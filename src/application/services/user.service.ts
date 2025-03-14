import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { User } from "../../core/entities/user.entity.js";
import { compare, hash } from "bcryptjs";
import { IsEmail, validate } from "class-validator";
import jwt from "jsonwebtoken";

export class UserService {
    constructor(private readonly userRepo: UserRepository){}

    private async validateEmail(email: string): Promise<void> {
        class EmailValidtor {
            @IsEmail()
            tempEmail: string;

            constructor(tempEmail: string) { this.tempEmail = tempEmail; }
        }
        const validateEmail = new EmailValidtor(email);
        const errs = await validate(validateEmail);

        if (errs.length) throw Error('Invalid email format');
    }
    
    async createUser(name: string, email: string, password: string) {
        await this.validateEmail(email);
        
        const userExists = await this.userRepo.getUserByEmail(email);
        if (userExists) {
            throw Error('Email already exists');
        }

        if (password.length < 8) throw Error('Password must be at least 8 characters long');

        const user = new User(
            name,
            email,
            await hash(password, 8)
        );
        return this.userRepo.createUser(user);
    }

    async updateUser(id: string, name?: string, email?: string, password?: string) {
        if(email) {
            const emailExists = await this.getUserByEmail(email);
            if (emailExists) throw Error('Email is already used');
            
            await this.validateEmail(email);
        }

        if (password && password.length < 8) throw Error('Password must be at least 8 characters long');

        return this.userRepo.updateUser(
            id,
            name,
            email,
            password ? await hash(password, 8) : undefined
        );
    }

    async getUserById(id: string) {
        return this.userRepo.getUserById(id);
    }

    async getUserByEmail(email: string) {
        return this.userRepo.getUserByEmail(email);
    }

    async generateAccessToken(email: string, password: string) {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

        const user: User | null = await this.userRepo.getUserByEmail(email);
        if (!user) throw new Error('Email is not registered');

        const isMatchedPassword = await compare(password, user.password);
        if (!isMatchedPassword) throw Error('Invalid password');

        const payload = {
            id: (user as any).id,
            email: user.email,
            iat: Date.now()/1000
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: '10d'
        });

        const { password: _, ...userWithoutPassword } = user;

        return { token, userWithoutPassword };
    }

    async getAllUsers(page: number, limit: number) {
        return this.userRepo.getAllUsers(page, limit);
    }
}