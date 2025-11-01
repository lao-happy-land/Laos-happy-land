import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/entities/news.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetNewsDto } from './dto/get-news.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsType } from 'src/entities/news-type.entity';
import { TranslateService } from 'src/service/translate.service';
import { GetOneNewDto } from './dto/get-new-id.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly translateService: TranslateService,
    private readonly entityManager: EntityManager,
  ) {}

  private mapLang(param: string): string {
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

  async create(createNewsDto: CreateNewsDto) {
    const newsType = await this.entityManager.findOneBy(NewsType, {
      id: createNewsDto.newsTypeId,
    });
    if (!newsType) {
      throw new Error('News type not found');
    }
    const news = this.newsRepository.create({
      ...createNewsDto,
      type: newsType,
    });
    await this.entityManager.save(news);
    return { news, message: 'News created successfully' };
  }

  async getAll(params: GetNewsDto) {
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

    const targetLang = this.mapLang(params.lang || 'VND');

    let translatedNews = await Promise.all(
      allNews.map(async (r) => {
        r.title = await this.translateService.translateText(
          r.title,
          targetLang,
        );
        r.type.name = await this.translateService.translateText(
          r.type.name,
          targetLang,
        );
        return r;
      }),
    );

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      translatedNews = translatedNews.filter((r) =>
        r.title?.toLowerCase().includes(searchLower),
      );
    }
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResult = translatedNews.slice(startIndex, endIndex);

    const pageMetaDto = new PageMetaDto({
      itemCount: translatedNews.length,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(paginatedResult, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneNewDto) {
    const news = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.type', 'newsType')
      .where('news.id = :id', { id })
      .getOne();

    if (!news) {
      throw new Error('News not found');
    }

    news.viewCount = (news.viewCount || 0) + 1;
    await this.entityManager.save(news);

    const targetLang = this.mapLang(params.lang || 'VND');

    news.title = await this.translateService.translateText(
      news.title,
      targetLang,
    );

    if (Array.isArray(news.details)) {
      news.details = await Promise.all(
        news.details.map(async (item) => {
          if (item.value && item.type !== 'image') {
            return {
              ...item,
              value: await this.translateService.translateText(
                item.value,
                targetLang,
              ),
            };
          }
          return item;
        }),
      );
    }

    if (news.type && news.type.name) {
      news.type.name = await this.translateService.translateText(
        news.type.name,
        targetLang,
      );
    }

    return { news, message: 'Success' };
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) {
      throw new Error('News not found');
    }
    if (news) {
      if (updateNewsDto.title) {
        news.title = updateNewsDto.title;
      }
      if (updateNewsDto.details) {
        news.details = updateNewsDto.details;
      }
      if (updateNewsDto.newsTypeId) {
        const newsType = await this.entityManager.findOneBy(NewsType, {
          id: updateNewsDto.newsTypeId,
        });
        if (!newsType) {
          throw new Error('News type not found');
        }
        news.type = newsType;
      }
    }
    await this.entityManager.save(news);
    return { news, message: 'News updated successfully' };
  }

  async remove(id: string) {
    const news = await this.newsRepository.findOneBy({ id });
    if (!news) {
      throw new Error('News not found');
    }
    await this.entityManager.remove(news);
    return { message: 'News deleted successfully' };
  }
}
