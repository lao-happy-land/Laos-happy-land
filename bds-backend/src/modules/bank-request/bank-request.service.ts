// src/modules/bank-request/bank-request.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankRequestDto } from './dto/create-bank-request.dto';
import { BankRequest } from 'src/entities/bank-request.entity';
import { BankRequestStatus } from 'src/common/enum/enum';
import { UpdateBankRequestStatusDto } from './dto/update-bank-request.dto';

@Injectable()
export class BankRequestService {
  constructor(
    @InjectRepository(BankRequest)
    private readonly bankRequestRepo: Repository<BankRequest>,
  ) {}

  async create(dto: CreateBankRequestDto) {
    const existing = await this.bankRequestRepo.findOne({
      where: { email: dto.email },
    });
    if (existing && existing.status === BankRequestStatus.PENDING) {
      throw new BadRequestException('You already have a pending request');
    }

    const request = this.bankRequestRepo.create({
      ...dto,
      status: BankRequestStatus.PENDING,
    });

    await this.bankRequestRepo.save(request);
    return { message: 'Bank request submitted successfully', request };
  }

  async findAll(status?: BankRequestStatus) {
    const qb = this.bankRequestRepo
      .createQueryBuilder('request')
      .orderBy('request.priority', 'DESC')
      .addOrderBy('request.createdAt', 'DESC');

    if (status) {
      qb.andWhere('request.status = :status', { status });
    }

    const result = await qb.getMany();

    return { message: 'Success', result };
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
    const req = await this.bankRequestRepo.findOneBy({ id });
    if (!req) throw new BadRequestException('Request not found');

    Object.assign(req, dto);
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
