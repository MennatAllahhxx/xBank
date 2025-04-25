import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { User, UserRole } from "../../core/entities/user.entity.js";
import { compare, hash } from "bcryptjs";
import { IsEmail, validate } from "class-validator";
import jwt from "jsonwebtoken";

export class UserService {
    constructor(private readonly user_repo: UserRepository){}

    private async validateEmail(email: string): Promise<void> {
        class EmailValidtor {
            @IsEmail()
            temp_email: string;

            constructor(temp_email: string) { this.temp_email = temp_email; }
        }
        const validateEmail = new EmailValidtor(email);
        const errs = await validate(validateEmail);

        if (errs.length) throw Error('Invalid email format');
    }
    
    async createUser(name: string, email: string, password: string, role: UserRole) {
        await this.validateEmail(email);
        
        const user_exists = await this.user_repo.getUserByEmail(email);
        if (user_exists) {
            throw Error('Email already exists');
        }

        if (password.length < 8) throw Error('Password must be at least 8 characters long');

        const user = new User(
            name,
            email,
            await hash(password, 8),
            role
        );
        return this.user_repo.createUser(user);
    }

    async updateUser(id: string, name?: string, email?: string, password?: string) {
        if(email) {
            const email_exists = await this.getUserByEmail(email);
            if (email_exists) throw Error('Email is already used');
            
            await this.validateEmail(email);
        }

        if (password && password.length < 8) throw Error('Password must be at least 8 characters long');

        return this.user_repo.updateUser(
            id,
            name,
            email,
            password ? await hash(password, 8) : undefined
        );
    }

    async getUserById(id: string) {
        return this.user_repo.getUserById(id);
    }

    async getUserByEmail(email: string) {
        return this.user_repo.getUserByEmail(email);
    }

    async generateAccessToken(email: string, password: string) {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

        const user: User | null = await this.user_repo.getUserByEmail(email);
        if (!user) throw new Error('Email is not registered');

        const isMatchedPassword = await compare(password, user.password);
        if (!isMatchedPassword) throw Error('Invalid password');

        const payload = {
            id: (user as any).id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now()/1000)
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '10d'
        });

        const { password: _, ...user_without_password } = user;

        return { token, user_without_password };
    }

    async getAllUsers(page: number, limit: number) {
        return this.user_repo.getAllUsers(page, limit);
    }

    async getAllUsersByRole(role: UserRole) {
        return this.user_repo.getAllUsersByRole(role);
    }

    async deleteUser(id: string) {
        return this.user_repo.deleteUser(id);
    }
}