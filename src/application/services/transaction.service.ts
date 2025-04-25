import { Transaction } from "../../core/entities/transaction.entity.js";
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
            sender_account_id,
            receiver_account_id,
            amount
        );

        try {
            await this.account_repo.updateAccountBalance(sender_account_id, amount * -1);
            await this.account_repo.updateAccountBalance(receiver_account_id, amount);
        } catch(_) {
            throw Error('Error updating balnaces for both accounts')
        }

        return this.transaction_repo.createTransfer(trx);
    }
}