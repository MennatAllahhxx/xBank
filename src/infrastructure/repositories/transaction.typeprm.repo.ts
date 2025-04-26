import { inject, injectable } from "tsyringe";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { DataSource } from "typeorm";
import { TransactionOrmEntity } from "../entities/transaction.orm-entity.js";
import { Transaction } from "../../core/entities/transaction.entity.js";

@injectable()
export class TransactionTypeOrmRepository implements TransactionRepository {
    private repo;

    constructor(@inject(DataSource) private data_source: DataSource) {
        this.repo = this.data_source.getRepository(TransactionOrmEntity)
    }

    async createTransfer(transaction: Transaction): Promise<Transaction> {
        const orm_trx = new TransactionOrmEntity();

        orm_trx.sender_account_id = transaction.sender_account_id;
        orm_trx.receiver_account_id = transaction.receiver_account_id;
        orm_trx.amount = transaction.amount;

        const saved_trx = await this.repo.save(orm_trx);
        return new Transaction(
            saved_trx.sender_account_id,
            saved_trx.receiver_account_id,
            saved_trx.amount,
            saved_trx.id,
            saved_trx.created_at,
            saved_trx.updated_at
        );
    }
}