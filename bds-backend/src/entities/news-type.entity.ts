import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { News } from './news.entity';
import { AbstractEntity } from 'src/common/entities';

@Entity('news_types')
export class NewsType extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; 

  @OneToMany(() => News, (news) => news.type)
  news: News[];
}
