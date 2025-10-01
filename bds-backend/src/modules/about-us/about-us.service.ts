import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from 'src/entities/about-us.entity';
import { Repository } from 'typeorm';
import { CreateAboutUsDto } from './dto/create-about-us.dto';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
  ) {}

  async getAboutUs() {
    let aboutUs = await this.aboutUsRepository.findOneBy({});
    if (!aboutUs) {
      aboutUs = this.aboutUsRepository.create({});
      await this.aboutUsRepository.save(aboutUs);
    }
    return { aboutUs, message: 'Success' };
  }

  async updateAboutUs(updateDto: UpdateAboutUsDto) {
    let aboutUs = await this.aboutUsRepository.findOneBy({});
    if (!aboutUs) {
      aboutUs = this.aboutUsRepository.create(updateDto);
    } else {
      Object.assign(aboutUs, updateDto);
    }
    await this.aboutUsRepository.save(aboutUs);
    return { aboutUs, message: 'About us updated successfully' };
  }
}
