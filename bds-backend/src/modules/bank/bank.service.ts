import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { Bank } from 'src/entities/bank.entity';
import { TranslateService } from 'src/service/translate.service';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { GetOneBankDto } from './dto/get-bank-id.dto';
import { GetBankDto } from './dto/get-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

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

  public async saveTranslations(bank: Bank) {
    const langs = ['en', 'lo', 'vi'];
    const translatedContent: Record<string, any> = {};

    for (const lang of langs) {
      const translated = {
        name: bank.name
          ? await this.translateService.translateText(bank.name, lang)
          : null,
        termRates: bank.termRates
          ? await Promise.all(
              bank.termRates.map(async (t) => ({
                ...t,
                term: t.term
                  ? await this.translateService.translateText(t.term, lang)
                  : t.term,
              })),
            )
          : null,
      };
      translatedContent[lang] = translated;
    }

    bank.translatedContent = translatedContent;
    await this.bankRepository.save(bank);
  }

  async create(createBankDto: CreateBankDto) {
    const bank = this.bankRepository.create(createBankDto);
    await this.bankRepository.save(bank);

    await this.saveTranslations(bank);

    return { bank, message: 'Bank created successfully' };
  }

  private pickTranslatedContent(bank: Bank, lang: string) {
    if (!bank.translatedContent) return bank;
    const translated = bank.translatedContent?.[lang];
    if (!translated) return bank;

    const merged: any = {
      ...bank,
      name: translated.name || bank.name,
      termRates: translated.termRates || bank.termRates,
    };

    delete merged.translatedContent;
    return merged;
  }

  async getAll(params: GetBankDto) {
    const bankQuery = this.bankRepository
      .createQueryBuilder('bank')
      .skip(params.skip)
      .take(params.perPage)
      .orderBy('bank.createdAt', params.OrderSort);

    if (params.search) {
      bankQuery.andWhere('bank.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    const [result, total] = await bankQuery.getManyAndCount();
    const targetLang = this.mapLang(params.lang);

    const translatedResult = result.map((item) =>
      this.pickTranslatedContent(item, targetLang),
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
    const translatedBank = this.pickTranslatedContent(bank, targetLang);

    return { bank: translatedBank, message: 'Success' };
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

    await this.saveTranslations(bank);

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
