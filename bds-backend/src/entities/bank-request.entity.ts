import { AbstractEntity } from 'src/common/entities';
import { BankRequestStatus } from 'src/common/enum/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bank } from './bank.entity';

@Entity({ name: 'bank_requests' })
export class BankRequest extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({
    type: 'enum',
    enum: BankRequestStatus,
    default: BankRequestStatus.PENDING,
  })
  status: BankRequestStatus;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @ManyToOne(() => Bank, (bank) => bank.bank_requests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;
}
