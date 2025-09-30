import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from 'src/entities/about-us.entity';
import { Repository } from 'typeorm';
import { CreateAboutUsDto } from './dto/create-about-us.dto';
import { GetAboutUsDto } from './dto/get-about-us.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
  ) {}

  async create(createAboutUsDto: CreateAboutUsDto) {
    const aboutUs = this.aboutUsRepository.create(createAboutUsDto);
    await this.aboutUsRepository.save(aboutUs);
    return { aboutUs, message: 'About us created successfully' };
  }

  async getAll(params: GetAboutUsDto) {
    const aboutUs = this.aboutUsRepository
      .createQueryBuilder('aboutUs')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('aboutUs.createdAt', params.OrderSort);

    if (params.search) {
      aboutUs.andWhere('aboutUs.title ILIKE :search', { search: `%${params.search}%` });
    }
    const [result, total] = await aboutUs.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const aboutUs = await this.aboutUsRepository
      .createQueryBuilder('aboutUs')
      .where('aboutUs.id = :id', { id })
      .getOne();
    if (!aboutUs) {
      throw new Error('About us not found');
    }
    return { aboutUs, message: 'Success' };
  }

  async update(id:string, updateAboutUsDto: UpdateAboutUsDto) {
    const aboutUs = await this.aboutUsRepository.findOneBy({ id });
    if (!aboutUs) {
      throw new Error('About us not found');
    }
    if (updateAboutUsDto.title) {
      aboutUs.title = updateAboutUsDto.title;
    }
    if (updateAboutUsDto.content) {
      aboutUs.content = updateAboutUsDto.content;
    }
    await this.aboutUsRepository.save(aboutUs);
    return { aboutUs, message: 'About us updated successfully' };
  }

  async remove(id:string) {
    const aboutUs = await this.aboutUsRepository.findOneBy({ id });
    if (!aboutUs) {
      throw new Error('About us not found');
    }
    await this.aboutUsRepository.remove(aboutUs);
    return { message: 'About us deleted successfully' };
  }
}
