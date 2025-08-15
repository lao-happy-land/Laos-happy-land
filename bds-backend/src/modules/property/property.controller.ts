import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create_property.dto';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    files: {
      mainImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    return this.propertyService.create(
      createPropertyDto,
      files.mainImage?.[0],
      files.images || [],
    );
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(@Query() params: GetPropertiesFilterDto) {
    return this.propertyService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Property found' })
  async get(@Param('id') id: string) {
    return this.propertyService.get(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles()
    files: {
      mainImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    return this.propertyService.update(
      id,
      updatePropertyDto,
      files.mainImage?.[0],
      files.images?.length ? files.images : undefined,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
