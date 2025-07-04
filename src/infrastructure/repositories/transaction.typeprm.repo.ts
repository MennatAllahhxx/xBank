import { inject, injectable } from "tsyringe";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { Between, DataSource, In } from "typeorm";
import { TransactionOrmEntity } from "../entities/transaction.orm-entity.js";
import { Status, Transaction } from "../../core/entities/transaction.entity.js";

@injectable()
export class TransactionTypeOrmRepository implements TransactionRepository {
    private repo;

    constructor(@inject(DataSource) private data_source: DataSource) {
        this.repo = this.data_source.getRepository(TransactionOrmEntity)
    }

    async createTransaction(transaction: Transaction): Promise<Transaction> {
        const orm_trx = new TransactionOrmEntity();

        orm_trx.sender_account_id = transaction.sender_account_id;
        orm_trx.account_id = transaction.account_id;
        orm_trx.amount = transaction.amount;
        orm_trx.source = transaction.source;
        orm_trx.status = transaction.status;
        orm_trx.type = transaction.type;
        orm_trx.payment_intent_id = transaction.payment_intent_id;

        const saved_trx = await this.repo.save(orm_trx);
        return new Transaction(
            saved_trx.account_id,
            saved_trx.amount,
            saved_trx.source,
            saved_trx.status,
            saved_trx.type,
            saved_trx.sender_account_id,
            saved_trx.payment_intent_id,
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
        // TODO: to be implemented later
        if (type) return [];

        const query_options: any = {
            skip: (page - 1) * limit,
            take: limit
        };

        if (start_date && end_date) {
            const date_condition = { created_at: Between(start_date, end_date) };

            if (account_ids?.length) {
                query_options.where = [
                    { ...date_condition, account_id: In(account_ids) },
                    { ...date_condition, sender_account_id: In(account_ids) }
                ]
            } else {
                query_options.where = date_condition;
            }
        } else if (account_ids?.length) {
            query_options.where = [
                { account_id: In(account_ids) },
                { sender_account_id: In(account_ids) }
            ]
        }

        const all_trx = await this.repo.find(query_options);

        try {
            return all_trx.map(trx => new Transaction(
                trx.account_id,
                trx.amount,
                trx.source,
                trx.status,
                trx.type,
                trx.sender_account_id,
                trx.payment_intent_id,
                trx.id,
                trx.created_at,
                trx.updated_at
            ));
        } catch (err) {
            console.log('Error mapping transaction entities: ', err);
            throw new Error('Failed to process transaction data');
        }
    }

    async updateTransactionStatus(
        id: string,
        status: Status
    ): Promise<Transaction | null> {
        const trx = await this.repo.findOneBy({ id });
        if (!trx) return null;

        trx.status = status;        
        const updated_trx = await this.repo.save(trx);

        return new Transaction(
            updated_trx.account_id,
            updated_trx.amount,
            updated_trx.source,
            updated_trx.status,
            updated_trx.type,
            updated_trx.sender_account_id,
            updated_trx.payment_intent_id,
            updated_trx.id,
            updated_trx.created_at,
            updated_trx.updated_at
        );
    }


    async getTransactionByPaymentIntentId(payment_intent_id: string): Promise<Transaction | null> {
        const trx = await this.repo.findOneBy({ payment_intent_id });
        if (!trx) return null;
        return new Transaction(
            trx.account_id,
            trx.amount,
            trx.source,
            trx.status,
            trx.type,
            trx.sender_account_id,
            trx.payment_intent_id,
            trx.id,
            trx.created_at,
            trx.updated_at
        );
    }
}