import { Account, AccountType } from "../../core/entities/account.entity.js";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";

export class AccountService {
    constructor(private readonly account_repo: AccountRepository, private readonly user_repo: UserRepository){}

    async createAccount(account_type: AccountType, user_id: string, balance: number) {
        const user = await this.user_repo.getUserById(user_id);

        if (!user) {
            throw Error('User does not exist');
        }

        const account = new Account(
            user_id,
            account_type,
            balance
        );
        return this.account_repo.createAccount(account);
    }

    async getAccountsByUserId(user_id: string) {
        const user = await this.user_repo.getUserById(user_id);

        if (!user) {
            throw Error('User does not exist');
        }

        return this.account_repo.getAccountsByUserId(user_id);
    }
}