import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { NewsType } from './news-type.entity';
import { AbstractEntity } from 'src/common/entities';

@Entity('news')
export class News extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @ManyToOne(() => NewsType, (type) => type.news, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'type_id' })
  type: NewsType;
}
