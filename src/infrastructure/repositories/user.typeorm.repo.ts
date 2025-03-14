import { DataSource } from "typeorm";
import { User } from "../../core/entities/user.entity.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { UserOrmEntity } from "../entities/user.orm-entity.js";


export class UserTypeOrmRepository implements UserRepository {
    private repo;

    constructor(private dataSource: DataSource) {
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
            savedUser.id,
            savedUser.createdAt,
            savedUser.updatedAt
        );
    }

    async updateUser(id: string, name?: string, email?: string, password?: string): Promise<User | null> {
        const user: UserOrmEntity | null = await this.repo.findOneBy({id});

        if (user) {
            if (name) user.name = name;
            if (email) user.email = email;
            if (password) user.password = password;
            this.repo.save(user);
        }        

        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.repo.findOneBy({id});
        if (user) {
            return new User(
                user.name,
                user.email,
                user.password,
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
                user.id,
                user.createdAt,
                user.updatedAt
            );
        }
        return null;
    }

    async getAllUsers(): Promise<Array<User>> {
        const users = await this.repo.find();
        const foundUsers: Array<User> = [];
        if (users) {
            
            users.forEach(user => {
                foundUsers.push(new User(
                    user.name,
                    user.email,
                    user.password,
                    user.id,
                    user.createdAt,
                    user.updatedAt
                ));
            });
        }

        return foundUsers;
    }
}