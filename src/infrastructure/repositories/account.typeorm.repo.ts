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

        orm_acc.user_id = account.user_id;
        orm_acc.balance = account.balance;
        orm_acc.account_type = account.account_type;

        const saved_acc = await this.repo.save(orm_acc);

        return new Account(
            saved_acc.user_id,
            saved_acc.account_type,
            saved_acc.balance,
            saved_acc.id,
            saved_acc.created_at,
            saved_acc.updated_at
        );
    }

    async getAccountsByUserId(user_id: string): Promise<Array<Account>> {
        const accounts = await this.repo.findBy({user_id});

        return accounts.map(acc => new Account(
            acc.user_id,
            acc.account_type,
            acc.balance,
            acc.id,
            acc.created_at,
            acc.updated_at
        ))
    }
}