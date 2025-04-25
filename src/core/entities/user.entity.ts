import { BaseEntity } from './base.entity.js';
import { IsEmail, Length } from 'class-validator';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    SUPPORT = 'support'
}

export class User extends BaseEntity {
    @Length(3, 255)
    name: string;

    @Length(3, 255)
    @IsEmail()
    email: string;

    @Length(8, 255)
    password: string;

    role: UserRole;

    constructor(
        name: string, 
        email: string, 
        password: string,
        role?: UserRole,
        id?: string,
        created_at?: Date,
        updated_at?: Date
    ) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.role = role? role : UserRole.USER;
    }
}