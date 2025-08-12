import { AbstractEntity } from 'src/common/entities';
import { RoleEnum } from 'src/common/enum/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];
}

