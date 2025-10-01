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
  ) {}

  // Lấy Setting duy nhất
  async getSetting() {
    let setting = await this.settingRepository.findOneBy({});

    if (!setting) {
      // Tạo mặc định nếu chưa có
      setting = this.settingRepository.create({});
      await this.settingRepository.save(setting);
    }
    return { setting, message: 'Success' };
  }

  // Cập nhật Setting duy nhất
  async updateSetting(updateDto: CreateSettingDto) {
    let setting = await this.settingRepository.findOneBy({});

    if (!setting) {
      setting = this.settingRepository.create(updateDto);
    } else {
      Object.assign(setting, updateDto); // Gán các field cập nhật
    }
    await this.settingRepository.save(setting);
    return { setting, message: 'Setting updated successfully' };
  }
}
