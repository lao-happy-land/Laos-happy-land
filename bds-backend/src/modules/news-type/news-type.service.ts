import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsType } from 'src/entities/news-type.entity';
import { Repository } from 'typeorm';
import { CreateNewsTypeDto } from './dto/create-news-type.dto';
import { GetNewsTypeDto } from './dto/get-news-type.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { TranslateService } from 'src/service/translate.service';
import { GetOneNewDto } from './dto/get-new-type-id.dto';

@Injectable()
export class NewsTypeService {
  constructor(
    @InjectRepository(NewsType)
    private readonly newsTypeRepository: Repository<NewsType>,
    private readonly translateService: TranslateService,
  ) {}

  private mapLang(param?: string): string {
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

  async create(createNewsTypeDto: CreateNewsTypeDto) {
    const newsType = this.newsTypeRepository.create(createNewsTypeDto);
    await this.newsTypeRepository.save(newsType);
    return { newsType, message: 'News type created successfully' };
  }

  async getAll(params: GetNewsTypeDto) {
    const newsTypes = this.newsTypeRepository
      .createQueryBuilder('newsType')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('newsType.createdAt', params.OrderSort);
    const [result, total] = await newsTypes.getManyAndCount();

    const targetLang = this.mapLang(params.lang);
    const translatedResult = await Promise.all(
      result.map(async (item) => {
        if (item.name) {
          item.name = await this.translateService.translateText(
            item.name,
            targetLang,
          );
        }
        return item;
      }),
    );
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(translatedResult, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneNewDto) {
    const newsType = await this.newsTypeRepository
      .createQueryBuilder('newsType')
      .where('newsType.id = :id', { id })
      .getOne();
    if (!newsType) {
      throw new BadRequestException('News type not found');
    }
    const targetLang = this.mapLang(params.lang);
    if (newsType.name) {
      newsType.name = await this.translateService.translateText(
        newsType.name,
        targetLang,
      );
    }

    return { newsType, message: 'Success' };
  }

  async update(id: string, updateNewsTypeDto: CreateNewsTypeDto) {
    const newsType = await this.newsTypeRepository.findOneBy({ id });
    if (!newsType) {
      throw new BadRequestException('News type not found');
    }
    newsType.name = updateNewsTypeDto.name;
    await this.newsTypeRepository.save(newsType);
    return { newsType, message: 'News type updated successfully' };
  }

  async remove(id: string) {
    const newsType = await this.newsTypeRepository.findOneBy({ id });
    if (!newsType) {
      throw new BadRequestException('News type not found');
    }
    await this.newsTypeRepository.remove(newsType);
    return { message: 'News type deleted successfully' };
  }
}
