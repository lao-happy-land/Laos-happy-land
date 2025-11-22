import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { News } from './news.entity';

type TranslatedContent = {
  vi?: { name: string | null };
  en?: { name: string | null };
  lo?: { name: string | null };
};

@Entity('news_types')
export class NewsType extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'json', nullable: true })
  translatedContent?: TranslatedContent;

  @OneToMany(() => News, (news) => news.type)
  news: News[];
}
