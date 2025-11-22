import { AbstractEntity } from 'src/common/entities';
import { TransactionEnum } from 'src/common/enum/enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';

type TranslatedContent = {
  vi?: { name: string | null };
  en?: { name: string | null };
  lo?: { name: string | null };
};

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

  @Column({ type: 'jsonb', nullable: true })
  translatedContent?: TranslatedContent;

  @OneToMany(() => Property, (property) => property.type)
  properties: Property[];
}
