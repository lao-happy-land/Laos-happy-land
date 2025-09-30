import { Module } from '@nestjs/common';
import { NewsTypeController } from './news-type.controller';
import { NewsTypeService } from './news-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsType } from 'src/entities/news-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsType])],
  controllers: [NewsTypeController],
  providers: [NewsTypeService]
})
export class NewsTypeModule {}
