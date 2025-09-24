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

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository (News)
        private readonly newsRepository: Repository<News>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(createNewsDto: CreateNewsDto) {
        const newsType = await this.entityManager.findOneBy(NewsType, { id: createNewsDto.newsTypeId });
        if (!newsType) {
            throw new Error('News type not found');
        }
        const news = this.newsRepository.create({...createNewsDto, type: newsType});
        await this.entityManager.save(news);
        return { news, message: 'News created successfully' };
    }

    async getAll(params: GetNewsDto) {
        const news = this.newsRepository
            .createQueryBuilder('news')
            .leftJoinAndSelect('news.type', 'newsType')
            .skip(params.skip)
            .take(params.perPage)
            .orderBy('news.createdAt', params.OrderSort);

        if (params.search) {
            news.andWhere('news.title ILIKE :search', { search: `%${params.search}%` });
        }

        if (params.newsType) {
            news.andWhere('newsType.name = :newsType', { newsType: params.newsType });
        }
            
        const [result, total] = await news.getManyAndCount();
        const pageMetaDto = new PageMetaDto({
            itemCount: total,
            pageOptionsDto: params,
        });
        return new ResponsePaginate(result, pageMetaDto, 'Success');
    }

    async get(id:string) {
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
                const newsType = await this.entityManager.findOneBy(NewsType, { id: updateNewsDto.newsTypeId });
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
