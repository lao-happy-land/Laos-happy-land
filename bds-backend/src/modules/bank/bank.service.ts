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
    @InjectRepository(Bank) private readonly bankRepository: Repository<Bank>,
    private readonly translateService: TranslateService,
  ) {}

  private mapLang(param?: string): 'vi' | 'en' | 'lo' {
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

  private async saveTranslations(bank: Bank) {
    const langs: ('vi' | 'en' | 'lo')[] = ['vi', 'en', 'lo'];
    const translatedContent: Record<
      string,
      { name: string; termRates: any[] }
    > = {};

    for (const lang of langs) {
      translatedContent[lang] = {
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
          : [],
      };
    }

    bank.translatedContent = translatedContent;
    await this.bankRepository.save(bank);
  }

  private pickTranslatedContent(bank: Bank, lang: 'vi' | 'en' | 'lo') {
    if (!bank.translatedContent) return bank;
    const translated =
      bank.translatedContent[lang] ?? bank.translatedContent['vi'];

    return {
      ...bank,
      name: translated?.name ?? bank.name,
      termRates: translated?.termRates ?? bank.termRates,
      translatedContent: bank.translatedContent,
    };
  }

  async create(createBankDto: CreateBankDto) {
    const bank = this.bankRepository.create(createBankDto);
    await this.bankRepository.save(bank);
    await this.saveTranslations(bank);

    const translatedBank = this.pickTranslatedContent(bank, 'vi');
    return { bank: translatedBank, message: 'Bank created successfully' };
  }

  async getAll(params: GetBankDto) {
    const allBanks = await this.bankRepository.find({
      order: { createdAt: params.OrderSort },
    });

    const targetLang = this.mapLang(params.lang);

    // Map translation trước
    let translated = allBanks.map((b) =>
      this.pickTranslatedContent(b, targetLang),
    );

    // Filter search trên name hoặc termRates
    if (params.search) {
      const keyword = params.search.toLowerCase();
      translated = translated.filter(
        (b) =>
          b.name?.toLowerCase().includes(keyword) ||
          b.termRates?.some((t) => t.term?.toLowerCase().includes(keyword)),
      );
    }

    // Paginate bằng JS
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const startIndex = (page - 1) * perPage;
    const paginated = translated.slice(startIndex, startIndex + perPage);

    const pageMetaDto = new PageMetaDto({
      itemCount: translated.length,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(paginated, pageMetaDto, 'Success');
  }

  async get(id: string, params: GetOneBankDto) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new BadRequestException('Bank not found');

    const targetLang = this.mapLang(params.lang);
    const translatedBank = this.pickTranslatedContent(bank, targetLang);

    return { bank: translatedBank, message: 'Success' };
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new BadRequestException('Bank not found');

    if (updateBankDto.name) bank.name = updateBankDto.name;
    if (updateBankDto.termRates) bank.termRates = updateBankDto.termRates;
    if (updateBankDto.imageUrl) bank.imageUrl = updateBankDto.imageUrl;

    await this.bankRepository.save(bank);
    await this.saveTranslations(bank);

    const translatedBank = this.pickTranslatedContent(bank, 'vi');
    return { bank: translatedBank, message: 'Bank updated successfully' };
  }

  async remove(id: string) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new BadRequestException('Bank not found');

    await this.bankRepository.remove(bank);
    return { message: 'Bank deleted successfully' };
  }
}
