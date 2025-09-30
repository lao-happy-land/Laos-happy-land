import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from 'src/entities/setting.entity';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create_setting.dto';
import { GetSettingDto } from './dto/get_setting.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { Multer } from 'multer';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    const setting = this.settingRepository.create(createSettingDto);
    await this.settingRepository.save(setting);
    return { setting, message: 'Setting created successfully' };
  }

  async getAll(params: GetSettingDto) {
    const settings = this.settingRepository
      .createQueryBuilder('setting')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('setting.createdAt', params.OrderSort);
    const [result, total] = await settings.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const setting = await this.settingRepository
      .createQueryBuilder('setting')
      .where('setting.id = :id', { id })
      .getOne();
    if (!setting) {
      throw new BadRequestException('Setting not found');
    }
    return { setting, message: 'Success' };
  }

  async update(
    id: string,
    updateSettingDto: CreateSettingDto
  ) {
    const setting = await this.settingRepository.findOneBy({ id });
    if (!setting) {
      throw new BadRequestException('Setting not found');
    }
    if (updateSettingDto.images) {
      setting.images = updateSettingDto.images;
    }
    if (updateSettingDto.banner) {
      setting.banner = updateSettingDto.banner;
    }
    if (updateSettingDto.description) {
      setting.description = updateSettingDto.description;
    }
    if (updateSettingDto.hotline) {
      setting.hotline = updateSettingDto.hotline;
    }
    if (updateSettingDto.facebook) {
      setting.facebook = updateSettingDto.facebook;
    }
    await this.settingRepository.save(setting);
    return { setting, message: 'Setting updated successfully' };
  }

  async remove(id: string) {
    const setting = await this.settingRepository.findOneBy({ id });
    if (!setting) {
      throw new BadRequestException('Setting not found');
    }
    await this.settingRepository.remove(setting);
    return { message: 'Setting deleted successfully' };
  }
}
