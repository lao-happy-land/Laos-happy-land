import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { User } from 'src/entities/user.entity';
import { News } from 'src/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, User, News])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
