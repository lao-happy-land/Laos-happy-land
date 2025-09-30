import { AbstractEntity } from 'src/common/entities';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column('json', { nullable: true })
  termRates: TermRate[];
}