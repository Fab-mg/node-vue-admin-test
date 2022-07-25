import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Role } from './role.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @ManyToOne( () => Role)
    role: Role;
}