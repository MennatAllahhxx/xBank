import { BaseEntity } from './base.entity.js';
import { IsEmail, Length } from 'class-validator';
import { hash } from 'bcryptjs';

export class User extends BaseEntity {
    @Length(3, 255)
    name: string;

    @Length(3, 255)
    @IsEmail()
    email: string;

    @Length(8, 255)
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

    async hashPassword(): Promise<void> {
        this.password = await hash(this.password, 8);
    }
}