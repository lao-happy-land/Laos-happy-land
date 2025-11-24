import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { NewsType } from 'src/entities/news-type.entity';
import { News } from 'src/entities/news.entity';
import { TranslateService } from 'src/service/translate.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetOneNewDto } from './dto/get-new-id.dto';
import { GetNewsDto } from './dto/get-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly translateService: TranslateService,
    private readonly entityManager: EntityManager,
  ) {}

  private mapLang(param: string): 'vi' | 'en' | 'lo' {
    switch (param?.toUpperCase()) {
      case 'USD':
        return 'en';
      case 'LAK':
        return 'lo';
      case 'VND':
      default:
        return 'vi';
    }
  }

  private async saveTranslations(news: News) {
    const langs: ('vi' | 'en' | 'lo')[] = ['vi', 'en', 'lo'];
    const translatedContent: Record<string, any> = {};

    for (const lang of langs) {
      const details = Array.isArray(news.details)
        ? await Promise.all(
            news.details.map(async (item) => {
              if (item?.value && item.type !== 'image') {
                return {
                  ...item,
                  value: await this.translateService.translateText(
                    item.value,
                    lang,
                  ),
                };
              }
              return item;
            }),
          )
        : null;

      translatedContent[lang] = {
        title: await this.translateService.translateText(news.title, lang),
        typeName: news.type?.name
          ? await this.translateService.translateText(news.type.name, lang)
          : null,
        details,
      };
    }

    news.translatedContent = translatedContent;
    await this.newsRepository.save(news);
  }

  private pickTranslatedContent(news: News, lang: 'vi' | 'en' | 'lo') {
    if (!news.translatedContent) return news;

    const translated =
      news.translatedContent[lang] ?? news.translatedContent['vi'];

    return {
      ...news,
      title: translated?.title || news.title,
      details: translated?.details || news.details,
      type: {
        ...news.type,
        name: translated?.typeName || news.type?.name,
      },
    };
  }

  async create(createNewsDto: CreateNewsDto) {
    const newsType = await this.entityManager.findOneBy(NewsType, {
      id: createNewsDto.newsTypeId,
    });
    if (!newsType) throw new BadRequestException('News type not found');

    const news = this.newsRepository.create({
      ...createNewsDto,
      type: newsType,
    });

    await this.saveTranslations(news);

    const translatedNews = this.pickTranslatedContent(news, 'vi');
    return { news: translatedNews, message: 'News created successfully' };
  }

  async getAll(params: GetNewsDto) {
    const targetLang = this.mapLang(params.lang || 'VND');

    const newsQuery = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.type', 'newsType')
      .orderBy('news.createdAt', params.OrderSort);

    if (params.newsTypeId) {
      newsQuery.andWhere('newsType.id = :newsTypeId', {
        newsTypeId: params.newsTypeId,
      });
    }

    const allNews = await newsQuery.getMany();

    let translatedNews = allNews.map((n) =>
      this.pickTranslatedContent(n, targetLang),
    );

    if (params.search) {
      const keyword = params.search.toLowerCase();
      translatedNews = translatedNews.filter((n) =>
        n.title?.toLowerCase().includes(keyword),
      );
    }

    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const paginated = translatedNews.slice(startIndex, startIndex + perPage);

    const pageMetaDto = new PageMetaDto({
      itemCount: translatedNews.length,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(paginated, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneNewDto) {
    const targetLang = this.mapLang(params.lang || 'VND');

    const news = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.type', 'newsType')
      .where('news.id = :id', { id })
      .getOne();

    if (!news) throw new NotFoundException('News not found');

    news.viewCount = (news.viewCount || 0) + 1;
    await this.entityManager.save(news);

    const translatedNews = this.pickTranslatedContent(news, targetLang);
    return { news: translatedNews, message: 'Success' };
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['type'],
    });
    if (!news) throw new NotFoundException('News not found');

    let needsTranslate = false;

    if (updateNewsDto.title) {
      news.title = updateNewsDto.title;
      needsTranslate = true;
    }

    if (updateNewsDto.details) {
      news.details = updateNewsDto.details;
      needsTranslate = true;
    }

    if (updateNewsDto.newsTypeId) {
      const newType = await this.entityManager.findOneBy(NewsType, {
        id: updateNewsDto.newsTypeId,
      });
      if (!newType) throw new BadRequestException('News type not found');
      news.type = newType;
      needsTranslate = true;
    }

    if (needsTranslate) {
      await this.saveTranslations(news);
    } else {
      await this.entityManager.save(news);
    }

    const translatedNews = this.pickTranslatedContent(news, 'vi');
    return { news: translatedNews, message: 'News updated successfully' };
  }

  async remove(id: string) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) throw new NotFoundException('News not found');

    await this.entityManager.remove(news);
    return { message: 'News deleted successfully' };
  }
}
