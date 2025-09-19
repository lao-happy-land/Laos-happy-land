import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LocationInfoService } from './location-info.service';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { CreateLocationInfoDto } from './dto/create_location_info.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('location-info')
export class LocationInfoController {
  constructor(private readonly locationInfoService: LocationInfoService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLocationInfoDto })
  @ApiResponse({ status: 200, description: 'Success' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async create(
    @Body() createLocationInfoDto: CreateLocationInfoDto,
    @UploadedFiles() files: { image?: Multer.File[] },
  ) {
    return this.locationInfoService.create(
      createLocationInfoDto,
      files.image?.[0],
    );
  }

  @Get()
  async getAll(@Body() params: any) {
    return this.locationInfoService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Location found successfully' })
  async get(@Param('id') id: string) {
    return this.locationInfoService.get(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateLocationInfoDto })
  @ApiResponse({ status: 200, description: 'Location info updated successfully' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async update(
    @Param('id') id: string,
    @Body() updateLocationInfoDto: CreateLocationInfoDto,
    @UploadedFiles() files: { image?: Multer.File[] },
  ) {
    return this.locationInfoService.update(id, updateLocationInfoDto, files.image?.[0]);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Location info deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.locationInfoService.remove(id);
  }
}
