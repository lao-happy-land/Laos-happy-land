import { AbstractEntity } from 'src/common/entities';
import { RoleEnum } from 'src/common/enum/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { UserRole } from './user-role.entity';

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

  @ManyToOne(() => UserRole, (role) => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  fromBank: {
    isFromBank?: boolean;
    imageUrl?: string;
    requested?: boolean;
    note?: string;
  };

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
