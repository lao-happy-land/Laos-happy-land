import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { PropertyController } from './property.controller';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { ExchangeRate } from 'src/entities/exchange-rates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, ExchangeRate])],
  providers: [PropertyService, CloudinaryService, ExchangeRateService],
  controllers: [PropertyController]
})
export class PropertyModule {}
