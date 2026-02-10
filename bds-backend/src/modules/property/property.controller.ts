import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import {
  AdminGuard,
  AuthGuard,
  OptionalAuthGuard,
} from '../auth/guard/auth.guard';
import { CreatePropertyDto } from './dto/create_property.dto';
import { GetPropertiesFilterDto } from './dto/get_property.dto';
import { GetPropertyByUserDto } from './dto/get_property_by_user.dto';
import { GetPropertyDetailDto } from './dto/get_property_id.dto';
import { RejectPropertyDto } from './dto/reject_property.dto';
import { UpdatePropertyDto } from './dto/update_property.dto';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ (LAK | USD | THB)',
    required: false,
    schema: { type: 'string', enum: ['LAK', 'USD', 'THB'] },
  })
  @ApiResponse({ status: 200, description: 'Property created successfully' })
  async create(@Req() req: Request, @Body() body: any) {
    const user = req.user as User;
    const priceSourceHeader =
      (req.headers['pricesource'] as string) ||
      (req.headers['price-source'] as string) ||
      'USD';
    body.priceSource = priceSourceHeader.toUpperCase();
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
    return this.propertyService.create(body as CreatePropertyDto, user);
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ hiển thị giá (USD | LAK | THB)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'THB'] },
  })
  @ApiHeader({
    name: 'currency',
    description: 'Ngôn ngữ hiển thị (USD = EN, LAK = LO, VND = VI)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAll(
    @Query() params: GetPropertiesFilterDto,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    const user = req.user as User;

    const priceSourceHeader =
      (headers['priceSource'] as string) ||
      (headers['pricesource'] as string) ||
      'USD';

    const currencyHeader =
      (headers['currency'] as 'USD' | 'LAK' | 'VND') ?? params.currency;

    const mergedParams: GetPropertiesFilterDto = {
      ...params,
      skip: params.skip ?? 0,
      perPage: params.perPage ?? 10,
      currency: currencyHeader,
      priceSource: priceSourceHeader.toUpperCase() as 'USD' | 'LAK' | 'THB',
    };

    return this.propertyService.getAll(mergedParams, user);
  }

  @Get('owner')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ hiển thị giá (USD | LAK | THB)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'THB'] },
  })
  @ApiHeader({
    name: 'currency',
    description: 'Ngôn ngữ hiển thị (USD = EN, LAK = LO, VND = VI)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getByUser(
    @Req() req: Request,
    @Query() params: GetPropertyByUserDto,
    @Headers() headers: Record<string, string>,
  ) {
    const user = req.user as User;

    const priceSourceHeader =
      headers['priceSource'] || headers['pricesource'] || 'USD';
    const currencyHeader =
      (headers['currency'] as 'USD' | 'LAK' | 'VND') ??
      params.currency ??
      'VND';

    const mergedParams: GetPropertyByUserDto = {
      ...params,
      skip: params.skip ?? 0,
      perPage: params.perPage ?? 10,
      currency: currencyHeader.toUpperCase() as 'USD' | 'LAK' | 'VND',
      priceSource: priceSourceHeader.toUpperCase() as 'USD' | 'LAK' | 'THB',
    };

    return this.propertyService.getByUser(mergedParams, user);
  }

  @Get('user/:userId')
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ hiển thị giá (USD | LAK | THB)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'THB'] },
  })
  @ApiHeader({
    name: 'currency',
    description: 'Ngôn ngữ hiển thị (USD = EN, LAK = LO, VND = VI)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getByUserId(
    @Param('userId') userId: string,
    @Query() params: GetPropertyByUserDto,
    @Headers() headers: Record<string, string>,
  ) {
    const priceSourceHeader =
      headers['priceSource'] || headers['pricesource'] || 'USD';
    const currencyHeader =
      (headers['currency'] as 'USD' | 'LAK' | 'VND') ??
      params.currency ??
      'VND';
    const mergedParams: GetPropertyByUserDto = {
      ...params,
      skip: params.skip ?? 0,
      perPage: params.perPage ?? 10,
      currency: currencyHeader.toUpperCase() as 'USD' | 'LAK' | 'VND',
      priceSource: priceSourceHeader.toUpperCase() as 'USD' | 'LAK' | 'THB',
    };

    return this.propertyService.getByUserId(userId, mergedParams);
  }

  @Get(':id')
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ hiển thị giá (USD | LAK | THB)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'THB'] },
  })
  @ApiHeader({
    name: 'currency',
    description: 'Ngôn ngữ hiển thị (USD = EN, LAK = LO, VND = VI)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Property found' })
  async get(
    @Param('id') id: string,
    @Query() params: GetPropertyDetailDto,
    @Headers() headers: Record<string, string>,
  ) {
    const priceSourceHeader =
      headers['priceSource'] || headers['pricesource'] || 'USD';
    const currencyHeader =
      (headers['currency'] as 'USD' | 'LAK' | 'VND') ??
      params.currency ??
      'VND';
    const mergedParams: GetPropertyDetailDto = {
      ...params,
      currency: currencyHeader.toUpperCase() as 'USD' | 'LAK' | 'VND',
      priceSource: priceSourceHeader.toUpperCase() as 'USD' | 'LAK' | 'THB',
    };

    return this.propertyService.get(id, mergedParams);
  }

  @Get(':id/similar')
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ hiển thị giá (USD | LAK | THB)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'THB'] },
  })
  @ApiHeader({
    name: 'currency',
    description: 'Ngôn ngữ hiển thị (USD = EN, LAK = LO, VND = VI)',
    required: false,
    schema: { type: 'string', enum: ['USD', 'LAK', 'VND'] },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getSimilarProperties(
    @Param('id') id: string,
    @Query() params: GetPropertyByUserDto,
    @Headers() headers: Record<string, string>,
  ) {
    const priceSourceHeader =
      headers['priceSource'] || headers['pricesource'] || 'USD';
    const currencyHeader =
      (headers['currency'] as 'USD' | 'LAK' | 'VND') ??
      params.currency ??
      'VND';

    const mergedParams: GetPropertyByUserDto = {
      ...params,
      skip: params.skip ?? 0,
      perPage: params.perPage ?? 10,
      currency: currencyHeader.toUpperCase() as 'USD' | 'LAK' | 'VND',
      priceSource: priceSourceHeader.toUpperCase() as 'USD' | 'LAK' | 'THB',
    };

    return this.propertyService.getSimilarProperties(id, mergedParams);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePropertyDto })
  @ApiHeader({
    name: 'priceSource',
    description: 'Đơn vị tiền tệ (LAK | USD | THB)',
    required: false,
    schema: { type: 'string', enum: ['LAK', 'USD', 'THB'] },
  })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: any,
  ) {
    const user = req.user as User;
    const priceSourceHeader =
      (req.headers['pricesource'] as string) ||
      (req.headers['price-source'] as string) ||
      'USD';

    body.priceSource = priceSourceHeader.toUpperCase();
    if (typeof body.location === 'string') {
      try {
        body.location = JSON.parse(body.location);
      } catch {}
    }
    return this.propertyService.update(id, body as UpdatePropertyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.propertyService.remove(id, user);
  }

  @Post(':id/increment-view')
  @ApiOperation({ summary: 'Increment property view count' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({
    status: 200,
    description: 'View count incremented successfully',
  })
  @ApiResponse({ status: 400, description: 'Property not found' })
  async incrementView(@Param('id') id: string) {
    return this.propertyService.incrementPropertyView(id);
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
