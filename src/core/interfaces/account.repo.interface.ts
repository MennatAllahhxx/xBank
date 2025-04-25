import { Account } from "../entities/account.entity.js";

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>;
    getAccountsByUserId(user_id: string): Promise<Array<Account>>;
}