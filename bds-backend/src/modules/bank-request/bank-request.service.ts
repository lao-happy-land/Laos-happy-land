// src/modules/bank-request/bank-request.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateBankRequestDto } from './dto/create-bank-request.dto';
import { BankRequest } from 'src/entities/bank-request.entity';
import { BankRequestStatus } from 'src/common/enum/enum';
import { UpdateBankRequestStatusDto } from './dto/update-bank-request.dto';
import { Bank } from 'src/entities/bank.entity';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { GetBankRequestDto } from './dto/get-bank-request.dto';

@Injectable()
export class BankRequestService {
  constructor(
    @InjectRepository(BankRequest)
    private readonly bankRequestRepo: Repository<BankRequest>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(dto: CreateBankRequestDto) {
    const existing = await this.bankRequestRepo.findOne({
      where: { email: dto.email },
    });
    if (existing && existing.status === BankRequestStatus.PENDING) {
      throw new BadRequestException('You already have a pending request');
    }

    let bank: Bank | null = null;
    if (dto.bankId) {
      bank = await this.entityManager.findOneBy(Bank, { id: dto.bankId });
      if (!bank) throw new BadRequestException('Bank not found');
    }

    const request = this.bankRequestRepo.create({
      ...dto,
      bank: bank,
      status: BankRequestStatus.PENDING,
    });

    await this.bankRequestRepo.save(request);
    return { message: 'Bank request submitted successfully', request };
  }

  async findAll(params: GetBankRequestDto) {
    const qb = this.bankRequestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.bank', 'bank')
      .orderBy('request.priority', 'DESC')
      .addOrderBy('request.createdAt', 'DESC');

    if (params.status) {
      qb.andWhere('request.status = :status', { status: params.status });
    }

    const [result, total] = await qb.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const req = await this.bankRequestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.bank', 'bank')
      .where('request.id = :id', { id });
    if (!req) throw new BadRequestException('Request not found');
    return { message: 'Success', req };
  }

  async approve(id: string) {
    const req = await this.bankRequestRepo.findOneBy({ id });
    if (!req) throw new BadRequestException('Request not found');
    req.status = BankRequestStatus.APPROVED;
    await this.bankRequestRepo.save(req);
    return { message: `Request from ${req.fullName} approved`, req };
  }

  async reject(id: string, note?: string) {
    const req = await this.bankRequestRepo.findOneBy({ id });
    if (!req) throw new BadRequestException('Request not found');
    req.status = BankRequestStatus.REJECTED;
    if (note) req.note = note;
    await this.bankRequestRepo.save(req);
    return { message: `Request from ${req.fullName} rejected`, req };
  }

  async update(id: string, dto: UpdateBankRequestStatusDto) {
    const req = await this.bankRequestRepo.findOne({
      where: { id },
      relations: ['bank'],
    });
    if (!req) throw new BadRequestException('Request not found');

    let bank: Bank | null = null;
    if (dto.bankId) {
      bank = await this.entityManager.findOneBy(Bank, { id: dto.bankId });
      if (!bank) throw new BadRequestException('Bank not found');
    }

    Object.assign(req, dto);
    if (bank) req.bank = bank;

    await this.bankRequestRepo.save(req);
    return { message: 'Bank request updated successfully', req };
  }

  async remove(id: string) {
    const req = await this.bankRequestRepo.findOneBy({ id });
    if (!req) throw new BadRequestException('Request not found');
    await this.bankRequestRepo.remove(req);
    return { message: 'Request deleted successfully' };
  }
}
