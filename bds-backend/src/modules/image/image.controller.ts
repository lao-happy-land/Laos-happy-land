import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { CloudinaryService } from 'src/service/cloudinary.service';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = await this.cloudinaryService.uploadAndReturnImageUrl(file);
    return {
      url: imageUrl,
      message: 'Image uploaded successfully',
    };
  }
}
