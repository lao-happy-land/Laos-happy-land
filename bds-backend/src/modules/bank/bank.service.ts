import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from 'src/entities/bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { GetBankDto } from './dto/get-bank.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank)
        private readonly bankRepository: Repository<Bank>,
    ) {}

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
            bank.andWhere('bank.name ILIKE :search', { search: `%${params.search}%` });
        }
        const [result, total] = await bank.getManyAndCount();
        const pageMetaDto = new PageMetaDto({
            itemCount: total,
            pageOptionsDto: params,
        });
        return new ResponsePaginate(result, pageMetaDto, 'Success');
    }

    async get(id: string) {
        const bank = await this.bankRepository
            .createQueryBuilder('bank')
            .where('bank.id = :id', { id })
            .getOne();
        if (!bank) {
            throw new BadRequestException('Bank not found');
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
        await this.bankRepository.save(bank);
        return { bank, message: 'Bank updated successfully' };
    }

    async remove(id:string) {
        const bank = await this.bankRepository.findOneBy({ id });
        if (!bank) {
            throw new BadRequestException('Bank not found');
        }
        await this.bankRepository.remove(bank);
        return { message: 'Bank deleted successfully' };
    }
}
