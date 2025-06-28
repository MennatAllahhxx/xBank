import { inject, injectable } from "tsyringe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { DataSource } from "typeorm";
import { AccountOrmEntity } from "../entities/account.orm-entity.js";
import { Account } from "../../core/entities/account.entity.js";

@injectable()
export class AccountTypeOrmRepository implements AccountRepository {
    private repo;

    constructor(@inject(DataSource) private data_source: DataSource) {
        this.repo = this.data_source.getRepository(AccountOrmEntity);
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

    async getAccountById(id: string): Promise<Account | null> {
        const account = await this.repo.findOneBy({id});

        if (account) {
            return new Account(
                account.user_id,
                account.account_type,
                account.balance,
                account.id,
                account.created_at,
                account.updated_at
            );
        }
        return null;
    }

    async updateAccountBalanceAfterDeposit(id: string, amount: number): Promise<Account | null> {

        return this.data_source.transaction(async manager => {
            const acc_repo = manager.getRepository(AccountOrmEntity);
            const account = await acc_repo.findOneBy({id});

            if (!account) return null;

            account.balance = Number(account.balance) + amount;
            const updated_acc = await acc_repo.save(account);

            return new Account(
                updated_acc.user_id,
                updated_acc.account_type,
                updated_acc.balance,
                updated_acc.id,
                updated_acc.created_at,
                updated_acc.updated_at
            );
        });
    }

    async updateAccountBalanceAfterWithdrawl(id: string, amount: number): Promise<Account | null> {

        return this.data_source.transaction(async manager => {
            const acc_repo = manager.getRepository(AccountOrmEntity);
            const account = await acc_repo.findOneBy({id});

            if (!account) return null;

            account.balance = Number(account.balance) - amount;
            const updated_acc = await acc_repo.save(account);

            return new Account(
                updated_acc.user_id,
                updated_acc.account_type,
                updated_acc.balance,
                updated_acc.id,
                updated_acc.created_at,
                updated_acc.updated_at
            );
        });
    }

    async updateAccountsBalancesAfterInternalTransfer(
        sender_account_id: string,
        receiver_account_id: string,
        amount: number
    ): Promise<[Account | null, Account | null]> {

        return this.data_source.transaction(async manager => {
            const acc_repo = manager.getRepository(AccountOrmEntity);
            const sender_account = await acc_repo.findOneBy({id: sender_account_id});
            const receiver_account = await acc_repo.findOneBy({id: receiver_account_id});

            if (!sender_account || !receiver_account) return [null, null];


            sender_account.balance = Number(sender_account.balance) - amount;
            receiver_account.balance = Number(receiver_account.balance) + amount;
            const updated_sender_acc = await acc_repo.save(sender_account);
            const updated_receiver_acc = await acc_repo.save(receiver_account);

            return [
                new Account(
                    updated_sender_acc.user_id,
                    updated_sender_acc.account_type,
                    updated_sender_acc.balance,
                    updated_sender_acc.id,
                    updated_sender_acc.created_at,
                    updated_sender_acc.updated_at
                ),
                new Account(
                    updated_receiver_acc.user_id,
                    updated_receiver_acc.account_type,
                    updated_receiver_acc.balance,
                    updated_receiver_acc.id,
                    updated_receiver_acc.created_at,
                    updated_receiver_acc.updated_at
                )
            ];
        });
    }
}