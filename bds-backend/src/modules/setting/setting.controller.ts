import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateSettingDto } from './dto/create_setting.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { GetSettingDto } from './dto/get_setting.dto';


@Controller('setting')
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Post()
    @ApiBody({ type: CreateSettingDto })
    @ApiResponse({ status: 200, description: 'Setting created successfully' })
    async create(
        @Body() createSettingDto: CreateSettingDto,
    ) {
        return this.settingService.create(createSettingDto);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Get all settings' })
    async getAll(@Query() params: GetSettingDto) {
        return this.settingService.getAll(params);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Get setting by id' })
    async get(@Param('id') id: string) {
        return this.settingService.get(id);
    }

    @Patch(':id')
    @ApiBody({ type: CreateSettingDto })
    @ApiResponse({ status: 200, description: 'Update setting by id' })
    async update(
        @Param('id') id: string,
        @Body() updateSettingDto: CreateSettingDto
    ) {
        return this.settingService.update(id, updateSettingDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete setting by id' })
    async remove(@Param('id') id: string) {
        return this.settingService.remove(id);
    }
}
