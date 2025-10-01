import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AboutUsService } from './about-us.service';
import { CreateAboutUsDto } from './dto/create-about-us.dto';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get about us' })
  async get() {
    return this.aboutUsService.getAboutUs();
  }

  @Patch()
  @ApiBody({ type: UpdateAboutUsDto })
  @ApiResponse({ status: 200, description: 'Update about us' })
  async update(@Body() updateDto: UpdateAboutUsDto) {
    return this.aboutUsService.updateAboutUs(updateDto);
  }
}
