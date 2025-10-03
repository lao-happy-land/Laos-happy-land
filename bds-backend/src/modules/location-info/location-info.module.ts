import { Module } from '@nestjs/common';
import { LocationInfoController } from './location-info.controller';
import { LocationInfoService } from './location-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationInfo } from 'src/entities/location-info.entity';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { TranslateService } from 'src/service/translate.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationInfo])],
  controllers: [LocationInfoController],
  providers: [LocationInfoService, CloudinaryService, TranslateService],
})
export class LocationInfoModule {}
