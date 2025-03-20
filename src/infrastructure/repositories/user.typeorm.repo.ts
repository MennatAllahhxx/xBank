import { DataSource, DeleteResult } from "typeorm";
import { User, UserRole } from "../../core/entities/user.entity.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { UserOrmEntity } from "../entities/user.orm-entity.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserTypeOrmRepository implements UserRepository {
    private repo;

    constructor(@inject(DataSource) private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(UserOrmEntity);
    }

    async createUser(user: User): Promise<User> {
        const ormUser = new UserOrmEntity();
        ormUser.name = user.name;
        ormUser.email = user.email;
        ormUser.password = user.password

        const savedUser = await this.repo.save(ormUser);

        return new User(
            savedUser.name,
            savedUser.email,
            savedUser.password,
            savedUser.role,
            savedUser.id,
            savedUser.createdAt,
            savedUser.updatedAt
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
            user.createdAt,
            user.updatedAt
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
                user.createdAt,
                user.updatedAt
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
                user.createdAt,
                user.updatedAt
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
            user.createdAt,
            user.updatedAt
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
            user.createdAt,
            user.updatedAt
        ));
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.repo.delete(id);
    }
}