import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BankService } from './bank.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBankDto } from './dto/create-bank.dto';
import { GetBankDto } from './dto/get-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('bank')
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @Post()
    @ApiOperation({ summary: 'Create bank' })
    @ApiResponse({ 
        status: 200,
        description: 'Create bank successfully',
    })
    async createBank(@Body() dto: CreateBankDto) {
        return this.bankService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all bank' })
    @ApiResponse({
        status: 200,
        description: 'Get all bank successfully',
    })
    async getAll(@Query() params: GetBankDto) {
        return this.bankService.getAll(params);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get bank by id' })
    @ApiResponse({
        status: 200,
        description: 'Get bank by id successfully',
    })
    async get(@Param('id') id: string) {
        return this.bankService.get(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update bank by id' })
    @ApiResponse({
        status: 200,
        description: 'Update bank by id successfully',
    })
    async update(@Param('id') id: string, @Body() dto: UpdateBankDto) {
        return this.bankService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete bank by id' })
    @ApiResponse({
        status: 200,
        description: 'Delete bank by id successfully',
    })
    async remove(@Param('id') id: string) {
        return this.bankService.remove(id);
    }
}
