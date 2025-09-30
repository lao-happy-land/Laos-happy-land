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
  AfterLoad,
} from 'typeorm';
import { Property } from './property.entity';
import { UserRole } from './user-role.entity';
import { LocationInfo } from './location-info.entity';
import { UserFeedback } from './user-feedback.entity';

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

  @ManyToOne(() => LocationInfo, (locationInfo) => locationInfo.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'location_info_id' })
  locationInfo: LocationInfo;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  fromBank: {
    isFromBank?: boolean;
    imageUrl?: string;
    requested?: boolean;
    note?: string;
  };

  @Column({ type: 'int', default: 0 })
  propertyCount: number;

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'float', default: 0 })
  ratingAverage: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'jsonb', nullable: true })
  specialties?: string[];

  @Column({ type: 'jsonb', nullable: true })
  languages?: string[];

  @Column({ type: 'jsonb', nullable: true })
  certifications?: string[];

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];

  @Column({ nullable: true })
  company?: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => UserFeedback, (fb) => fb.user)
  feedbacks: UserFeedback[];

  @OneToMany(() => UserFeedback, (fb) => fb.reviewer)
  sentFeedbacks: UserFeedback[];

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
