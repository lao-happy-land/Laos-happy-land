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
import { PropertyStatusEnum, TransactionEnum } from 'src/common/enum/enum';
import { PropertyType } from './property-type.entity';
import { LocationInfo } from './location-info.entity';

export interface PriceHistoryEntry {
  rates: Record<string, number>;
  date: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
  buildingNumber?: string;
  street?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  neighborhood?: string;
}

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

  @Column({ type: 'jsonb', nullable: true })
  price: Record<string, number>;

  @Column({ type: 'jsonb', nullable: true })
  priceHistory: PriceHistoryEntry[];

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ nullable: true })
  legalStatus: string;

  @Column({ type: 'jsonb', nullable: true })
  location: LocationData;

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

  @Column({
    type: 'enum',
    enum: PropertyStatusEnum,
    default: PropertyStatusEnum.PENDING,
  })
  status: PropertyStatusEnum;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @ManyToOne(() => LocationInfo, (locationInfo) => locationInfo.properties, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'location_info_id' })
  locationInfo: LocationInfo;

  constructor(property: Partial<Property>) {
    super();
    Object.assign(this, property);
  }
}

//content detail array object => {type: {example h1,p}, value: string}
