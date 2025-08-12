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

@Entity('properties')
export class Property extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  area: number;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ default: 0 })
  viewsCount: number;

  constructor(property: Partial<Property>) {
    super();
    Object.assign(this, property);
  }
}
