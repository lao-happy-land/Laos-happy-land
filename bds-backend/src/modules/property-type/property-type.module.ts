import { Module } from '@nestjs/common';
import { PropertyTypeController } from './property-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyType } from 'src/entities/property-type.entity';
import { PropertyTypeService } from './property-type.service';
import { TranslateService } from 'src/service/translate.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType])],
  providers: [PropertyTypeService, TranslateService],
  controllers: [PropertyTypeController]
})
export class PropertyTypeModule {}
