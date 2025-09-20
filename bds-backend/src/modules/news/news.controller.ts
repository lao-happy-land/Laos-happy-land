import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetNewsDto } from './dto/get-news.dto';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    @ApiOperation({ summary: 'Create news' })
    @ApiResponse({ status: 200, description: 'News created successfully' })
    async create(@Body() dto: CreateNewsDto) {
        return this.newsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all news' })
    @ApiResponse({ status: 200, description: 'Get all news' })
    async getAll(@Query() params: GetNewsDto) {
        return this.newsService.getAll(params);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get news by id' })
    @ApiResponse({ status: 200, description: 'Get news by id' })
    async get(@Param('id') id: string) {
        return this.newsService.get(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update news by id' })
    @ApiResponse({ status: 200, description: 'Update news by id' })
    async update(@Param('id') id: string, @Body() dto: CreateNewsDto) {
        return this.newsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete news by id' })
    @ApiResponse({ status: 200, description: 'Delete news by id' })
    async remove(@Param('id') id: string) {
        return this.newsService.remove(id);
    }
}
