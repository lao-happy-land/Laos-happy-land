// src/modules/bank-request/bank-request.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BankRequestService } from './bank-request.service';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateBankRequestDto } from './dto/create-bank-request.dto';
import { BankRequestStatus } from 'src/common/enum/enum';
import { AdminGuard } from '../auth/guard/auth.guard';
import { UpdateBankRequestStatusDto } from './dto/update-bank-request.dto';

@ApiTags('Bank Request')
@Controller('bank-request')
export class BankRequestController {
  constructor(private readonly bankRequestService: BankRequestService) {}

  @Post()
  @ApiBody({ type: CreateBankRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Bank request submitted successfully',
  })
  async create(@Body() dto: CreateBankRequestDto) {
    return this.bankRequestService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: BankRequestStatus })
  @ApiResponse({ status: 200, description: 'List of all bank requests' })
  async findAll(@Query('status') status?: BankRequestStatus) {
    return this.bankRequestService.findAll(status);
  }

  @Patch(':id/approve')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Bank request approved successfully',
  })
  async approve(@Param('id') id: string) {
    return this.bankRequestService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: { type: 'object', properties: { note: { type: 'string' } } },
  })
  @ApiResponse({
    status: 200,
    description: 'Bank request rejected successfully',
  })
  async reject(@Param('id') id: string, @Body('note') note?: string) {
    return this.bankRequestService.reject(id, note);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateBankRequestStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Bank request updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBankRequestStatusDto,
  ) {
    return this.bankRequestService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank request deleted successfully',
  })
  async remove(@Param('id') id: string) {
    return this.bankRequestService.remove(id);
  }
}
