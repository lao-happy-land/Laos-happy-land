import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { CloudinaryService } from 'src/service/cloudinary.service';

@Module({
  providers: [CloudinaryService],
  controllers: [ImageController]
})
export class ImageModule {}
