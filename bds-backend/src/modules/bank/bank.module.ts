import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from 'src/entities/bank.entity';
import { TranslateService } from 'src/service/translate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [BankService, TranslateService]
})
export class BankModule {}
