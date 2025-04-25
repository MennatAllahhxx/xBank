import { Response } from "express";
import { TransactionService } from "../../application/services/transaction.service.js";
import { AuthRequest } from "../types/auth.types.js";
import { Transaction } from "../../core/entities/transaction.entity.js";

export class TransactionController {
    constructor(private transaction_service: TransactionService) {
        this.transaction_service = transaction_service;
    }

    createTransaction = async (req: AuthRequest, res: Response) => {
        try {
            const {sender_account_id, receiver_account_id, amount} = req.body;
            const user_id = req.user?.id;

            if (!user_id) {
                res.status(400).json({ message: 'Unauthorized.' });
                return;
            }

            if (!sender_account_id) {
                res.status(400).json({ message: 'Sender\'s accound ID is required' });
                return;
            }

            if (!receiver_account_id) {
                res.status(400).json({ message: 'Receiver\'s accound ID is required' });
                return;
            }

            if (amount === null || amount == undefined || amount == 0) {
                res.status(400).json({ message: 'Amount is required' });
                return;
            }

            const trx: Transaction = await this.transaction_service.createTransfer(
                user_id,
                sender_account_id,
                receiver_account_id,
                amount
            );

            res.status(201).json(trx);
        } catch (err: any) {
            if (
                err.message === 'Transefered amount must be greater than 0' ||
                err.message === 'Receiver\'s account can not be the same as the sender\'s account' ||
                err.message === 'Sender\'s account does not exist' ||
                err.message === 'You are not allowed to manage this account' ||
                err.message === 'Receiver\'s account does not exist' ||
                err.message === 'Insufficient balance. Transaction can not be completed.'
            ) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}