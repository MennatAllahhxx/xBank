import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { UserTypeOrmRepository } from "./repositories/user.typeorm.repo.js";
import { UserRepository } from "../core/interfaces/user.repo.interface.js";
import { AppDataSource } from "./db/database.js";

container.registerInstance(DataSource, AppDataSource);
container.registerSingleton<UserRepository>(
    'UserRepository',
    UserTypeOrmRepository
);