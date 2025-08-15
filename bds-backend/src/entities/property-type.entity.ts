import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Property } from './property.entity';
import { AbstractEntity } from 'src/common/entities';

@Entity('property_types')
export class PropertyType extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Property, (property) => property.type)
  properties: Property[];
}
