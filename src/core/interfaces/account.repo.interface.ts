import { Account } from "../entities/account.entity.js";

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>;
    getAccountsByUserId(user_id: string): Promise<Array<Account>>;
    getAccountById(id: string): Promise<Account | null>;
    updateAccountBalance(id: string, amount: number): Promise<Account | null>;
    updateAccountsBalancesAtomically(
        sender_account_id: string,
        receiver_account_id: string,
        amount: number
    ): Promise<[Account | null, Account | null]>;

}