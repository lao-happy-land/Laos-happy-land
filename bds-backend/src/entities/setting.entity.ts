import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class Setting extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true })
  banner: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  hotline: string;

  @Column({ type: 'text', nullable: true })
  facebook: string;
}
