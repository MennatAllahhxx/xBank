import { inject, injectable } from "tsyringe";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { Between, DataSource, In } from "typeorm";
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

    async getTransactions(
        page: number,
        limit: number,
        account_ids?: string[],
        type?: string,
        start_date?: Date,
        end_date?: Date
    ): Promise<Array<Transaction>> {
        let return_trx: Array<Transaction> = [];
        let all_trx;

        // TODO: to be implemented later
        if (type) return [];

        if (account_ids && account_ids.length) {
            if (start_date && end_date)
                all_trx = await this.repo.find({
                    where: [
                        {
                            created_at: Between(start_date, end_date),
                            receiver_account_id: In(account_ids)
                        },
                        {
                            created_at: Between(start_date, end_date),
                            sender_account_id: In(account_ids)
                        }
                    ],
                    skip: (page - 1) * limit,
                    take: limit
                });
            else
                all_trx = await this.repo.find({
                    where: [
                        {receiver_account_id: In(account_ids)},
                        {sender_account_id: In(account_ids)},
                    ],
                    skip: (page - 1) * limit,
                    take: limit
                });
        } else {
            if (start_date && end_date)
                all_trx = await this.repo.find({
                    where: {
                        created_at: Between(start_date, end_date)
                    },
                    skip: (page - 1) * limit,
                    take: limit
                });
            else
                all_trx = await this.repo.find({
                    skip: (page - 1) * limit,
                    take: limit
                }); ;
        }

        return_trx = all_trx.map(trx => new Transaction(
            trx.sender_account_id,
            trx.receiver_account_id,
            trx.amount,
            trx.id,
            trx.created_at,
            trx.updated_at
        ));

        return return_trx;
    }
}