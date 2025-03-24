import { Account } from "../entities/account.entity.js";

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>;
    getAccountsByUserId(userId: string): Promise<Array<Account>>;
}