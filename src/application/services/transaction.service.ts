import { Source, Status, Transaction, Type } from "../../core/entities/transaction.entity.js";
import { UserRole } from "../../core/entities/user.entity.js";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";

export class TransactionService {
    constructor(
        private readonly transaction_repo: TransactionRepository,
        private readonly account_repo: AccountRepository
    ) {}

    async createTransfer(
        user_id: string,
        sender_account_id: string,
        receiver_account_id: string,
        amount: number
    ) {
        if (amount <= 0) throw Error('Transeferred amount must be greater than 0');

        if (sender_account_id === receiver_account_id) throw Error('Receiver\'s account can not be the same as the sender\'s account');

        const sender_account = await this.account_repo.getAccountById(sender_account_id);

        if (!sender_account) throw Error('Sender\'s account does not exist');

        if (sender_account.user_id !== user_id) throw Error('You are not allowed to manage this account');

        const receiver_account = await this.account_repo.getAccountById(receiver_account_id);

        if (!receiver_account) throw Error('Receiver\'s account does not exist');

        if (Number(sender_account.balance) < amount) throw Error('Insufficient balance. Transaction can not be completed.');

        const trx = new Transaction(
            receiver_account_id,
            amount,
            Source.INTERNAL,
            Status.COMPLETED,
            Type.TRANSFER,
            sender_account_id,
        );

        try {
            await this.account_repo.updateAccountsBalancesAfterInternalTransfer(
                sender_account_id,
                receiver_account_id,
                amount
            );
        } catch(_) {
            throw Error('Error updating balances for both accounts')
        }

        return this.transaction_repo.createTransaction(trx);
    }

    async getTransactions(
        role: UserRole,
        user_id: string,
        page: number,
        limit: number,
        account_id?: string,
        type?: string,
        start_date?: Date,
        end_date?: Date
    ){
        if (page < 1 || limit < 1) throw Error('Both page and limit must be greater than 0');

        const acc_ids = [];

        if (account_id) {
            const account = await this.account_repo.getAccountById(account_id);

            if (!account) throw Error('This account does not exist');

            if (role === UserRole.USER && account.user_id !== user_id)
                throw Error('You are not allowed to manage this account');
            acc_ids.push(account_id);
        } else if (role === UserRole.USER) {
            (await this.account_repo.getAccountsByUserId(user_id)).map(acc => acc_ids.push(acc.getId()));
        }

        return await this.transaction_repo.getTransactions(
            page,
            limit,
            acc_ids,
            type,
            start_date,
            end_date
        );
    }

    async getTransactionByPaymentIntentId(payment_intent_id: string) {
        return await this.transaction_repo.getTransactionByPaymentIntentId(payment_intent_id);
    }
}