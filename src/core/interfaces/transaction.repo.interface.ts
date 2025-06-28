import { Status, Transaction } from "../entities/transaction.entity.js";

export interface TransactionRepository {
    createTransaction(transaction: Transaction): Promise<Transaction>;
    getTransactions(
        page:number,
        limit: number,
        account_ids?: string[],
        type?: string,
        start_date?: Date,
        end_date?: Date
    ): Promise<Array<Transaction>>;
    updateTransactionStatus(
        id: string,
        status: Status
    ): Promise<Transaction | null>;
    getTransactionByPaymentIntentId(payment_intent_id: string): Promise<Transaction | null>;
}