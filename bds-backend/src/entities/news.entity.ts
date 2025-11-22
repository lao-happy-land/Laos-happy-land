import { AbstractEntity } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsType } from './news-type.entity';

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

  @Column({ type: 'int', default: 0 })
  viewCount: number;
  @Column({ type: 'jsonb', nullable: true })
  translatedContent: {
    en?: {
      title?: string;
      typeName?: string;
      details?: any;
    };
    lo?: {
      title?: string;
      typeName?: string;
      details?: any;
    };
    vi?: {
      title?: string;
      typeName?: string;
      details?: any;
    };
  };
}
