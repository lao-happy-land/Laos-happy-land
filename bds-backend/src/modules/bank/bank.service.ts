import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from 'src/entities/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { GetBankDto } from './dto/get-bank.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateBankDto } from './dto/update-bank.dto';
import { TranslateService } from 'src/service/translate.service';
import { GetOneBankDto } from './dto/get-bank-id.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    private readonly translateService: TranslateService,
  ) {}

  private mapLang(param?: string): string {
    switch (param?.toUpperCase()) {
      case 'USD':
        return 'en';
      case 'LAK':
        return 'lo';
      case 'VND':
      default:
        return 'vi';
    }
  }

  async create(createBankDto: CreateBankDto) {
    const bank = this.bankRepository.create(createBankDto);
    await this.bankRepository.save(bank);
    return { bank, message: 'Bank created successfully' };
  }

  async getAll(params: GetBankDto) {
    const bank = this.bankRepository
      .createQueryBuilder('bank')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('bank.createdAt', params.OrderSort);

    if (params.search) {
      bank.andWhere('bank.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    const [result, total] = await bank.getManyAndCount();
    const targetLang = this.mapLang(params.lang);

    const translatedResult = await Promise.all(
      result.map(async (item) => {
        if (item.name) {
          item.name = await this.translateService.translateText(
            item.name,
            targetLang,
          );
        }
        if (Array.isArray(item.termRates)) {
          item.termRates = await Promise.all(
            item.termRates.map(async (t) => ({
              ...t,
              term: t.term
                ? await this.translateService.translateText(t.term, targetLang)
                : t.term,
            })),
          );
        }
        return item;
      }),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(translatedResult, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneBankDto) {
    const bank = await this.bankRepository
      .createQueryBuilder('bank')
      .where('bank.id = :id', { id })
      .getOne();

    if (!bank) {
      throw new BadRequestException('Bank not found');
    }

    const targetLang = this.mapLang(params.lang);

    if (targetLang) {
      if (bank.name) {
        bank.name = await this.translateService.translateText(
          bank.name,
          targetLang,
        );
      }
      if (Array.isArray(bank.termRates)) {
        bank.termRates = await Promise.all(
          bank.termRates.map(async (t) => ({
            ...t,
            term: t.term
              ? await this.translateService.translateText(t.term, targetLang)
              : t.term,
          })),
        );
      }
    }

    return { bank, message: 'Success' };
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) {
      throw new BadRequestException('Bank not found');
    }
    if (updateBankDto.name) bank.name = updateBankDto.name;
    if (updateBankDto.termRates) bank.termRates = updateBankDto.termRates;
    if (updateBankDto.imageUrl) bank.imageUrl = updateBankDto.imageUrl;
    await this.bankRepository.save(bank);
    return { bank, message: 'Bank updated successfully' };
  }

  async remove(id: string) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) {
      throw new BadRequestException('Bank not found');
    }
    await this.bankRepository.remove(bank);
    return { message: 'Bank deleted successfully' };
  }
}
