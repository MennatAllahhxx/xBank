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

            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                res.status(400).json({ message: 'A positive amount value is required' });
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
                err.message.includes('account') || 
                err.message.includes('balance') || 
                err.message.includes('amount') || 
                err.message.includes('not allowed')
            ) {
                res.status(400).json({ message: err.message });
                return;
            }

            console.log('Error creating transaction: ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getTransactions = async (req: AuthRequest, res: Response) => {
        try {
            const {
                page,
                limit,
                account_id,
                type,
                start_date,
                end_date
            } = req.query;

            const user = req.user;
            if (!user) {
                res.status(400).json({ message: 'Unauthorized.' });
                return;
            }

            if ((start_date || end_date) && !(start_date && end_date)) {
                res.status(400).json({ message: 'Start date and end date must be provided together' });
                return;
            }


            const trx: Transaction[] = await this.transaction_service.getTransactions(
                user.role,
                user.id,
                page? parseInt(page as string) : 1,
                limit? parseInt(limit as string) : 10,
                account_id as string,
                type as string,
                start_date? new Date(start_date as string) : undefined,
                end_date? new Date(end_date as string) : undefined
            );

            res.status(200).json(trx);
        } catch (err: any) {
            if (
                err.message.includes('Unauthorized') ||
                err.message.includes('account') ||
                err.message.includes('provided') ||
                err.message.includes('Both') ||
                err.message.includes('entities')
            ) {
                res.status(400).json({ message: err.message });
                return;
            }

            console.log('Error getting transactions: ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}