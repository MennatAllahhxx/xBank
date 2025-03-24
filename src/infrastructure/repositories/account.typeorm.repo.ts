import { inject, injectable } from "tsyringe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { DataSource } from "typeorm";
import { AccountOrmEntity } from "../entities/account.orm-entity.js";
import { Account } from "../../core/entities/account.entity.js";

@injectable()
export class AccountTypeOrmRepository implements AccountRepository {
    private repo;

    constructor(@inject(DataSource) private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(AccountOrmEntity);
    }

    async createAccount(account: Account): Promise<Account> {
        const orm_acc = new AccountOrmEntity();

        orm_acc.userId = account.userId;
        orm_acc.balance = account.balance;
        orm_acc.accountType = account.accountType;

        const saved_acc = await this.repo.save(orm_acc);

        return new Account(
            saved_acc.userId,
            saved_acc.accountType,
            saved_acc.balance,
            saved_acc.id,
            saved_acc.createdAt,
            saved_acc.updatedAt
        );
    }

    async getAccountsByUserId(userId: string): Promise<Array<Account>> {
        const accounts = await this.repo.findBy({userId});

        return accounts.map(acc => new Account(
            acc.userId,
            acc.accountType,
            acc.balance,
            acc.id,
            acc.createdAt,
            acc.updatedAt
        ))
    }
}