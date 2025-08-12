// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
// } from 'typeorm';
// import { Property } from './property.entity';

// @Entity('property_types')
// export class PropertyType {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   code: string;

//   @Column()
//   name: string;

//   @OneToMany(() => Property, (property) => property.type)
//   properties: Property[];
// }
