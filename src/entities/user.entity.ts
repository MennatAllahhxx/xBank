import { 
    Entity, 
    Column
} from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}