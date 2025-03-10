import { 
    Entity, 
    Column
} from 'typeorm';
import { BaseEntity } from './base.entity.ts';

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}