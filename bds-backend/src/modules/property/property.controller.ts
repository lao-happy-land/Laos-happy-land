import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create_property.dto';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property created successfully' })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
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
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const result = await this.propertyService.update(id, updatePropertyDto);
    return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
