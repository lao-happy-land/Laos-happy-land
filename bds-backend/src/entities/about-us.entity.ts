import { AbstractEntity } from "src/common/entities"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('about_us')
export class AboutUs extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true})
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string
}