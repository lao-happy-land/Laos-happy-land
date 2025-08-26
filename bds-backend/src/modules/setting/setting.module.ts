import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from 'src/entities/setting.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService, CloudinaryService]
})
export class SettingModule {}
