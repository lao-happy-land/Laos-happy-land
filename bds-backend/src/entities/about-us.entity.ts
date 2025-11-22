import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('about_us')
export class AboutUs extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  content: any;
}
