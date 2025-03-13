import { BaseEntity } from './base.entity.js';

export class User extends BaseEntity {
    name: string;
    email: string;
    password: string;

    constructor(
        name: string, 
        email: string, 
        password: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}