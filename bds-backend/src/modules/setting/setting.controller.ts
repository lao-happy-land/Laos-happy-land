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

  @Get()
  @ApiResponse({ status: 200, description: 'Get setting' })
  async get() {
    return this.settingService.getSetting();
  }

  @Patch()
  @ApiBody({ type: CreateSettingDto })
  @ApiResponse({ status: 200, description: 'Update setting' })
  async update(@Body() updateSettingDto: CreateSettingDto) {
    return this.settingService.updateSetting(updateSettingDto);
  }
}
