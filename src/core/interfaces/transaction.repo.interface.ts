import { Transaction } from "../entities/transaction.entity.js";

export interface TransactionRepository {
    createTransfer(transaction: Transaction): Promise<Transaction>;
    getTransactions(
        page:number,
        limit: number,
        account_ids?: string[],
        type?: string,
        start_date?: Date,
        end_date?: Date
    ): Promise<Array<Transaction>>;
}