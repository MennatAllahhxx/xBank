import { Account } from "../entities/account.entity.js";

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>;
    getAccountsByUserId(user_id: string): Promise<Array<Account>>;
    getAccountById(id: string): Promise<Account | null>;
    updateAccountBalance(id: string, balance: number): Promise<Account | null>;
}