import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create_property.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { RejectPropertyDto } from './dto/reject_property.dto';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';
import {
  AdminGuard,
  AuthGuard,
  OptionalAuthGuard,
} from '../auth/guard/auth.guard';
import { GetPropertyDetailDto } from './dto/get_property_id.dto';
import { GetPropertyByUserDto } from './dto/get_property_by_user.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles()
    files: {
      mainImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    const user = req.user as User;
    if (typeof body.details === 'string') {
      try {
        body.details = JSON.parse(body.details);
      } catch {}
    }
    if (typeof body.location === 'string') {
      try {
        body.location = JSON.parse(body.location);
      } catch {}
    }
    return this.propertyService.create(
      body as CreatePropertyDto,
      files.mainImage?.[0],
      files.images || [],
      user,
    );
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'currency',
    description: 'Currency filter (LAK | USD | VND)',
    required: false,
    schema: { type: 'string', enum: ['LAK', 'USD', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(
    @Query() params: GetPropertiesFilterDto,
    @Headers() rawHeaders: Record<string, string>,
    @Req() req: Request,
  ) {
    const user = req.user as User;

    const mergedParams: GetPropertiesFilterDto = {
      skip: params.skip ?? 0,
      perPage: params.perPage ?? 10,
      ...params,
      currency:
        (rawHeaders['currency'] as 'LAK' | 'USD' | 'VND') ?? params.currency,
    };

    return this.propertyService.getAll(mergedParams, user);
  }

@Get('owner')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'currency',
  description: 'Currency filter (LAK | USD | VND)',
  required: false,
  schema: { type: 'string', enum: ['LAK', 'USD', 'VND'] },
})
@ApiResponse({ status: 200, description: 'Success' })
async getByUser(
  @Req() req: Request,
  @Query() params: GetPropertyByUserDto,
  @Headers() rawHeaders: Record<string, string>,
) {
  const user = req.user as User;

  const mergedParams: GetPropertyByUserDto = {
    skip: params.skip ?? 0,
    perPage: params.perPage ?? 10,
    ...params,
    currency: (rawHeaders['currency'] as 'LAK' | 'USD' | 'VND') ?? params.currency,
  };

  return this.propertyService.getByUser(mergedParams, user);
}

  @Get(':id')
  @ApiHeader({
    name: 'currency',
    description: 'Currency filter (LAK | USD | VND)',
    required: false,
    schema: { type: 'string', enum: ['LAK', 'USD', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Property found' })
  async get(
    @Param('id') id: string,
    @Query() params: GetPropertyDetailDto,
    @Headers() rawHeaders: Record<string, string>,
  ) {
    const mergedParams: GetPropertyDetailDto = {
      ...params,
      currency:
        (rawHeaders['currency'] as 'LAK' | 'USD' | 'VND') ?? params.currency,
    };

    return this.propertyService.get(id, mergedParams);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
    @Body() body: any,
    @UploadedFiles()
    files: {
      mainImage?: Multer.File[];
      images?: Multer.File[];
    },
  ) {
    if (typeof body.location === 'string') {
      try {
        body.location = JSON.parse(body.location);
      } catch {}
    }
    return this.propertyService.update(
      id,
      body as UpdatePropertyDto,
      files.mainImage?.[0],
      files.images?.length ? files.images : undefined,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.propertyService.remove(id, user);
  }

  @Patch(':id/approve')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async approve(@Param('id') id: string) {
    return this.propertyService.approveProperty(id);
  }

  @Patch(':id/reject')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiBody({
    type: RejectPropertyDto,
    description: 'Reason for rejection (optional)',
  })
  @ApiResponse({ status: 200, description: 'Property rejected successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async reject(
    @Param('id') id: string,
    @Body() rejectPropertyDto: RejectPropertyDto,
  ) {
    return this.propertyService.rejectProperty(id, rejectPropertyDto);
  }
}
