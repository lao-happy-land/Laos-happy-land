import { AbstractEntity } from "src/common/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_role')
export class UserRole extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @OneToMany(() => User, (user) => user.role)
    users: User[]
}