import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Property } from './property.entity';
import { AbstractEntity } from 'src/common/entities';
import { TransactionEnum } from 'src/common/enum/enum';

@Entity('property_types')
export class PropertyType extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TransactionEnum,
    default: TransactionEnum.SALE,
    nullable: false,
  })
  transactionType: TransactionEnum;

  @OneToMany(() => Property, (property) => property.type)
  properties: Property[];
}
