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
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { RejectPropertyDto } from './dto/reject_property.dto';

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
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(@Query() params: GetPropertiesFilterDto) {
    return this.propertyService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Property found' })
  async get(@Param('id') id: string) {
    return this.propertyService.get(id);
  }

  @Get('owner/:userId')
  @ApiResponse({ status: 200, description: 'Success' })
  async getByUser(
    @Param('userId') userId: string,
    @Query() params: PageOptionsDto,
  ) {
    return this.propertyService.getByUser(userId, params);
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

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async approve(@Param('id') id: string) {
    return this.propertyService.approveProperty(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiBody({
    type: RejectPropertyDto,
    description: 'Reason for rejection (optional)',
  })
  @ApiResponse({ status: 200, description: 'Property rejected successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async reject(@Param('id') id: string, @Body() rejectPropertyDto: RejectPropertyDto) {
    return this.propertyService.rejectProperty(id, rejectPropertyDto);
  }
}
