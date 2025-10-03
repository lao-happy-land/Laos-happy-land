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
import { PropertyTypeService } from './property-type.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreatePropertyTypeDto } from './dto/create_property_type.dto';
import { GetPropertyTypeDto } from './dto/get_property_type.dto';
import { GetOnePropertyTypeDto } from './dto/get_property_type_id.dto';

@Controller('property-type')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property type' })
  @ApiResponse({
    status: 201,
    description: 'Property type created successfully',
  })
  async create(@Body() dto: CreatePropertyTypeDto) {
    return this.propertyTypeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all property types with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of property types with pagination',
  })
  async getAll(@Query() query: GetPropertyTypeDto) {
    return this.propertyTypeService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property type by ID' })
  @ApiResponse({ status: 200, description: 'Single property type' })
  async get(@Param('id') id: string, @Query() params: GetOnePropertyTypeDto) {
    return this.propertyTypeService.get(id, params);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a property type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Property type updated successfully',
  })
  async update(@Param('id') id: string, @Body() dto: CreatePropertyTypeDto) {
    return this.propertyTypeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Property type deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.propertyTypeService.remove(id);
  }
}
