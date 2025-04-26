import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { UserTypeOrmRepository } from "./repositories/user.typeorm.repo.js";
import { UserRepository } from "../core/interfaces/user.repo.interface.js";
import { AppDataSource } from "./db/database.js";
import { AccountRepository } from "../core/interfaces/account.repo.interface.js";
import { AccountTypeOrmRepository } from "./repositories/account.typeorm.repo.js";
import { TransactionRepository } from "../core/interfaces/transaction.repo.interface.js";
import { TransactionTypeOrmRepository } from "./repositories/transaction.typeprm.repo.js";

container.registerInstance(DataSource, AppDataSource);
container.registerSingleton<UserRepository>(
    'UserRepository',
    UserTypeOrmRepository
);
container.registerSingleton<AccountRepository>(
    'AccountRepository',
    AccountTypeOrmRepository
);
container.registerSingleton<TransactionRepository>(
    'TransactionRepository',
    TransactionTypeOrmRepository
);