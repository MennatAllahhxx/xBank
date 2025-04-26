import { DataSource, DeleteResult } from "typeorm";
import { User, UserRole } from "../../core/entities/user.entity.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { UserOrmEntity } from "../entities/user.orm-entity.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserTypeOrmRepository implements UserRepository {
    private repo;

    constructor(@inject(DataSource) private data_source: DataSource) {
        this.repo = this.data_source.getRepository(UserOrmEntity);
    }

    async createUser(user: User): Promise<User> {
        const orm_user = new UserOrmEntity();
        orm_user.name = user.name;
        orm_user.email = user.email;
        orm_user.password = user.password
        orm_user.role = user.role;

        const saved_user = await this.repo.save(orm_user);

        return new User(
            saved_user.name,
            saved_user.email,
            saved_user.password,
            saved_user.role,
            saved_user.id,
            saved_user.created_at,
            saved_user.updated_at
        );
    }

    async updateUser(id: string, name?: string, email?: string, password?: string): Promise<User> {
        const user: UserOrmEntity | null = await this.repo.findOneBy({id});
        if (!user) throw Error('User is not found');

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        await this.repo.save(user);

        return new User(
            user.name,
            user.email,
            user.password,
            user.role,
            user.id,
            user.created_at,
            user.updated_at
        );
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.repo.findOneBy({id});
        if (user) {
            return new User(
                user.name,
                user.email,
                user.password,
                user.role,
                user.id,
                user.created_at,
                user.updated_at
            );
        }
        return null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.repo.findOneBy({email});
        if (user) {
            return new User(
                user.name,
                user.email,
                user.password,
                user.role,
                user.id,
                user.created_at,
                user.updated_at
            );
        }
        return null;
    }

    async getAllUsers(page: number, limit: number): Promise<Array<User>> {
        const users = await this.repo.find({
            skip: (page - 1) * limit,
            take: limit
        });

        return users.map(user => new User(
            user.name,
            user.email,
            user.password,
            user.role,
            user.id,
            user.created_at,
            user.updated_at
        ));
    }

    async getAllUsersByRole(role: UserRole): Promise<Array<User>> {
        const users = await this.repo.findBy({role});

        return users.map(user => new User(
            user.name,
            user.email,
            user.password,
            user.role,
            user.id,
            user.created_at,
            user.updated_at
        ));
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.repo.delete(id);
    }
}