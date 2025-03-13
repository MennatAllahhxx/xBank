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


}