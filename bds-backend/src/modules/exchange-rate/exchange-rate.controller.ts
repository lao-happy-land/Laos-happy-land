import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExchangeRateDto } from './dto/create_exchange_rate.dto';
import { GetExchangeRateDto } from './dto/get_exchange_rate.dto';
import { UpdateExchangeRateDto } from './dto/update_exchange_rate.dto';

@Controller('exchange-rate')
export class ExchangeRateController {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Post()
    @ApiOperation({summary: 'Create exchange rate'})
    @ApiResponse({
        status: 201,
        description: 'Exchange rate created',
    })
    async create(@Body() dto: CreateExchangeRateDto) {
        return await this.exchangeRateService.create(dto);
    }

    @Get()
    @ApiOperation({summary: 'Get all exchange rates'})
    @ApiResponse({
        status: 200,
        description: 'Exchange rates found',
    })
    async getAll(@Query() query: GetExchangeRateDto) {
        return await this.exchangeRateService.getAll(query);
    }

    @Get(':id')
    @ApiOperation({summary: 'Get exchange rate by id'})
    @ApiResponse({
        status: 200,
        description: 'Exchange rate found',
    })
    async get(@Param('id') id: string) {
        return await this.exchangeRateService.get(id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update exchange rate by id'})
    @ApiResponse({
        status: 200,
        description: 'Exchange rate updated',
    })
    async update(@Param('id') id: string, @Body() dto: UpdateExchangeRateDto) {
        return await this.exchangeRateService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete exchange rate by id'})
    @ApiResponse({
        status: 200,
        description: 'Exchange rate deleted',
    })
    async remove(@Param('id') id: string) {
        return await this.exchangeRateService.remove(id);
    }
}
