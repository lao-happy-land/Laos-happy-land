import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AboutUsService } from './about-us.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAboutUsDto } from './dto/create-about-us.dto';
import { GetAboutUsDto } from './dto/get-about-us.dto';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';

@Controller('about-us')
export class AboutUsController {
    constructor(private readonly aboutUsService: AboutUsService) {}

    @Post()
    @ApiOperation({ summary: 'Create about us' })
    @ApiResponse({ status: 200, description: 'Success' })
    async create(@Body() dto: CreateAboutUsDto) {
      return await this.aboutUsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all about us' })
    @ApiResponse({ status: 200, description: 'Success' })
    async getAll(@Query() params: GetAboutUsDto) {
      return await this.aboutUsService.getAll(params);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get about us by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    async get(@Param('id') id: string) {
      return await this.aboutUsService.get(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update about us by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    async update(@Param('id') id: string, @Body() dto: UpdateAboutUsDto) {
      return await this.aboutUsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete about us by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    async remove(@Param('id') id: string) {
      return await this.aboutUsService.remove(id);
    }
}
