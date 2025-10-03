import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NewsTypeService } from './news-type.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNewsTypeDto } from './dto/create-news-type.dto';
import { GetNewsTypeDto } from './dto/get-news-type.dto';
import { GetOneNewDto } from './dto/get-new-type-id.dto';

@Controller('news-type')
export class NewsTypeController {
    constructor(private readonly newsTypeService: NewsTypeService) {}

    @Post()
    @ApiOperation({ summary: 'Create news type' })
    @ApiResponse({
        status: 201,
        description: 'News type created successfully',
      })
    createNewsType(@Body() dto: CreateNewsTypeDto) {
      return this.newsTypeService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all news types' })
    @ApiResponse({
        status: 200,
        description: 'Success',
    })
    async getAll(@Query() params: GetNewsTypeDto) {
      return this.newsTypeService.getAll(params);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get news type by id' })
    @ApiResponse({
        status: 200,
        description: 'Success',
    })
    async get(@Param('id') id: string, @Query() params: GetOneNewDto) {
      return this.newsTypeService.get(id, params);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update news type by id' })
    @ApiResponse({
        status: 200,
        description: 'Success',
    })
    async update(@Param('id') id: string, @Body() dto: CreateNewsTypeDto) {
      return this.newsTypeService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete news type by id' })
    @ApiResponse({
        status: 200,
        description: 'Success',
    })
    async remove(@Param('id') id: string) {
      return this.newsTypeService.remove(id);
    }
}
