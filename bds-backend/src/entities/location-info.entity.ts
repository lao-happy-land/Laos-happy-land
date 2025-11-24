import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';
import { User } from './user.entity';

@Entity('location_infos')
export class LocationInfo extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  imageURL: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'text', array: true, nullable: true })
  strict: string[];

  @OneToMany(() => Property, (property) => property.locationInfo)
  properties: Property[];

  @OneToMany(() => User, (user) => user.locationInfo)
  users: User[];
  @Column({ type: 'jsonb', nullable: true })
  translatedContent: {
    en?: { name?: string };
    lo?: { name?: string };
    vi?: { name?: string };
  };
}
