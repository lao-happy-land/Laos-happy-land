import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from 'src/common/entities';
import { TransactionEnum } from 'src/common/enum/enum';
import { PropertyType } from './property-type.entity';

@Entity('properties')
export class Property extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => PropertyType, (type) => type.properties, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'type_id' })
  type: PropertyType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  priceHistory: any;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ nullable: true })
  legalStatus: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({
    type: 'enum',
    enum: TransactionEnum,
    default: TransactionEnum.SALE,
    nullable: false,
  })
  transactionType: TransactionEnum;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true })
  mainImage: string;

  constructor(property: Partial<Property>) {
    super();
    Object.assign(this, property);
  }
}

// list Image

// add provider

// remove area and bedroom bathrooms

// add json filed
