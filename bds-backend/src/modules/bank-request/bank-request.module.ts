import { Module } from '@nestjs/common';

import { BankRequestService } from './bank-request.service';
import { BankRequestController } from './bank-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankRequest } from 'src/entities/bank-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankRequest])],
  controllers: [BankRequestController],
  providers: [BankRequestService]
})
export class BankRequestModule {}
