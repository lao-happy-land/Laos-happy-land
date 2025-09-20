import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsType } from 'src/entities/news-type.entity';
import { Repository } from 'typeorm';
import { CreateNewsTypeDto } from './dto/create-news-type.dto';
import { GetNewsTypeDto } from './dto/get-news-type.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class NewsTypeService {
  constructor(
    @InjectRepository(NewsType)
    private readonly newsTypeRepository: Repository<NewsType>,
  ) {}

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
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id:string) {
    const newsType = await this.newsTypeRepository
        .createQueryBuilder('newsType')
        .where('newsType.id = :id', { id })
        .getOne();
    if (!newsType) {
      throw new BadRequestException('News type not found');
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
