import { AbstractEntity } from 'src/common/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BankRequest } from './bank-request.entity';

interface TermRate {
  term: string;
  interestRate: number;
}

@Entity()
export class Bank extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('json', { nullable: true })
  termRates: TermRate[];

  @OneToMany(() => BankRequest, (bankRequest) => bankRequest.bank)
  bank_requests: BankRequest[]
}