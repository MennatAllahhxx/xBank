import { Transaction } from "../entities/transaction.entity.js";

export interface TransactionRepository {
    createTransfer(transaction: Transaction): Promise<Transaction>;
}