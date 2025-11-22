import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { NewsType } from 'src/entities/news-type.entity';
import { TranslateService } from 'src/service/translate.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateNewsTypeDto } from './dto/create-news-type.dto';
import { GetOneNewDto } from './dto/get-new-type-id.dto';
import { GetNewsTypeDto } from './dto/get-news-type.dto';

@Injectable()
export class NewsTypeService {
  constructor(
    @InjectRepository(NewsType)
    private readonly newsTypeRepository: Repository<NewsType>,
    private readonly translateService: TranslateService,
    private readonly entityManager: EntityManager,
  ) {}

  private mapLang(param?: string): 'vi' | 'en' | 'lo' {
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

  private async generateTranslations(newsType: NewsType) {
    const languages: ('vi' | 'en' | 'lo')[] = ['vi', 'en', 'lo'];
    const result: Record<string, { name: string | null }> = {};

    for (const lang of languages) {
      result[lang] = {
        name: newsType.name
          ? await this.translateService.translateText(newsType.name, lang)
          : null,
      };
    }

    newsType.translatedContent = result;
  }

  private async saveTranslations(newsType: NewsType) {
    await this.generateTranslations(newsType);
    await this.entityManager.save(newsType);
  }

  private pickTranslation(newsType: NewsType, lang: 'vi' | 'en' | 'lo') {
    return (
      newsType.translatedContent?.[lang] ??
      newsType.translatedContent?.['vi'] ?? { name: newsType.name }
    );
  }

  async create(createNewsTypeDto: CreateNewsTypeDto) {
    const newsType = this.newsTypeRepository.create(createNewsTypeDto);
    await this.saveTranslations(newsType);

    const tr = this.pickTranslation(newsType, 'vi');

    return {
      newsType: {
        ...newsType,
        name: tr.name,
        translatedContent: newsType.translatedContent,
      },
      message: 'News type created successfully',
    };
  }

  async getAll(params: GetNewsTypeDto) {
    const targetLang = this.mapLang(params.lang);

    const query = this.newsTypeRepository
      .createQueryBuilder('newsType')
      .orderBy('newsType.createdAt', params.OrderSort)
      .skip(params.skip)
      .take(params.perPage);

    const [allNewsTypes, total] = await query.getManyAndCount();

    const translated = allNewsTypes.map((item) => {
      const tr = this.pickTranslation(item, targetLang);
      return {
        ...item,
        name: tr.name,
        translatedContent: item.translatedContent,
      };
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(translated, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneNewDto) {
    const newsType = await this.newsTypeRepository.findOneBy({ id });
    if (!newsType) throw new BadRequestException('News type not found');

    const targetLang = this.mapLang(params.lang);
    const tr = this.pickTranslation(newsType, targetLang);

    return {
      newsType: {
        ...newsType,
        name: tr.name,
        translatedContent: newsType.translatedContent,
      },
      message: 'Success',
    };
  }

  async update(id: string, updateNewsTypeDto: CreateNewsTypeDto) {
    const newsType = await this.newsTypeRepository.findOneBy({ id });
    if (!newsType) throw new BadRequestException('News type not found');

    let needsTranslate = false;
    if (updateNewsTypeDto.name && updateNewsTypeDto.name !== newsType.name) {
      newsType.name = updateNewsTypeDto.name;
      needsTranslate = true;
    }

    if (needsTranslate) {
      await this.saveTranslations(newsType);
    } else {
      await this.entityManager.save(newsType);
    }

    const tr = this.pickTranslation(newsType, 'vi');

    return {
      newsType: {
        ...newsType,
        name: tr.name,
        translatedContent: newsType.translatedContent,
      },
      message: 'News type updated successfully',
    };
  }

  async remove(id: string) {
    const newsType = await this.newsTypeRepository.findOneBy({ id });
    if (!newsType) throw new BadRequestException('News type not found');

    await this.entityManager.remove(newsType);
    return { message: 'News type deleted successfully' };
  }
}
