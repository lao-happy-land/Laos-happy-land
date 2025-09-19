import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PriceHistoryEntry, Property } from 'src/entities/property.entity';
import { ExchangeRate } from 'src/entities/exchange-rates.entity';
import { GetExchangeRateDto } from './dto/get_exchange_rate.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { CreateExchangeRateDto } from './dto/create_exchange_rate.dto';
import { UpdateExchangeRateDto } from './dto/update_exchange_rate.dto';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly entityManager: EntityManager,
  ) {}

  async getAll(params: GetExchangeRateDto) {
    const exchangeRates = this.exchangeRateRepository
      .createQueryBuilder('exchange_rate')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('exchange_rate.createdAt', params.OrderSort);
    const [result, total] = await exchangeRates.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const exchangeRate = await this.exchangeRateRepository
      .createQueryBuilder('exchange_rate')
      .where('exchange_rate.id = :id', { id })
      .getOne();
    if (!exchangeRate) {
      throw new NotFoundException('Exchange rate not found');
    }
    return { exchangeRate, message: 'Success' };
  }

  async create(createExchangeRateDto: CreateExchangeRateDto) {
    const exchangeRate = this.exchangeRateRepository.create(
      createExchangeRateDto,
    );
    await this.exchangeRateRepository.save(exchangeRate);
    return { exchangeRate, message: 'Exchange rate created successfully' };
  }

  async update(id: string, updateExchangeRateDto: UpdateExchangeRateDto) {
    const exchangeRate = await this.exchangeRateRepository.findOneBy({ id });
    if (!exchangeRate) {
      throw new NotFoundException('Exchange rate not found');
    }

    if (updateExchangeRateDto.rate) {
      exchangeRate.rate = updateExchangeRateDto.rate;
    }
    await this.exchangeRateRepository.save(exchangeRate);
    await this.recalculateAllProperties();

    return { exchangeRate, message: 'Exchange rate updated successfully' };
  }

  async remove(id: string) {
    const exchangeRate = await this.exchangeRateRepository.findOneBy({ id });
    if (!exchangeRate) throw new NotFoundException('Exchange rate not found');
    await this.exchangeRateRepository.remove(exchangeRate);
    return { message: 'Exchange rate deleted' };
  }

  async getRates(): Promise<Record<string, number>> {
    const rates = await this.exchangeRateRepository.find();
    const rec: Record<string, number> = {};
    rates.forEach((r) => {
      rec[r.currency] = Number(r.rate);
    });
    return rec;
  }

  private async recalculateAllProperties() {
    const rates = await this.getRates();
    const properties = await this.propertyRepository.find();

    for (const property of properties) {
      const latestUsd =
        property.price?.USD ??
        property.priceHistory?.[property.priceHistory.length - 1]?.rates?.USD;
      if (latestUsd === undefined || latestUsd === null) continue;

      const convertedLatest: Record<string, number> = { USD: latestUsd };
      Object.entries(rates).forEach(([currency, rate]) => {
        if (currency !== 'USD') convertedLatest[currency] = latestUsd * rate;
      });
      property.price = convertedLatest;

      if (property.priceHistory?.length) {
        property.priceHistory = property.priceHistory.map((entry) => {
          const usdOriginal = entry.rates?.USD ?? 0;
          const newRates: Record<string, number> = { USD: usdOriginal };
          Object.entries(rates).forEach(([currency, rate]) => {
            if (currency !== 'USD') newRates[currency] = usdOriginal * rate;
          });
          return {
            ...entry,
            rates: newRates,
          };
        });
      }
    }

    await this.entityManager.save(properties);
  }
}
