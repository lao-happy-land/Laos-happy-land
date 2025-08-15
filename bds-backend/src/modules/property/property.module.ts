import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { PropertyController } from './property.controller';
import { CloudinaryService } from 'src/service/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  providers: [PropertyService, CloudinaryService],
  controllers: [PropertyController]
})
export class PropertyModule {}
