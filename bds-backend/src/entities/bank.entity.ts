import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  bank_requests: BankRequest[];

  @Column({ type: 'jsonb', nullable: true })
  translatedContent: {
    en?: {
      name?: string;
      termRates?: TermRate[];
    };
    lo?: {
      name?: string;
      termRates?: TermRate[];
    };
    vi?: {
      name?: string;
      termRates?: TermRate[];
    };
  };

  constructor(partial: Partial<Bank>) {
    super();
    Object.assign(this, partial);
  }
}
