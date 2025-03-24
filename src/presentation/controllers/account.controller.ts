import { Request, Response } from "express";
import { AccountService } from "../../application/services/account.service.js";
import { Account, AccountType } from "../../core/entities/account.entity.js";

export class AccountController {
    constructor(private account_service: AccountService) {
        this.account_service = account_service;
    }

    createAccount = async (req: Request, res: Response) => {
        try {
            const user_id: string = req.body.user_id;
            const account_type = req.body.account_type;
            const balance: number = req.body.balance;

            if (!user_id || !account_type|| (balance === undefined || balance === null)) {
                res.status(400).json({
                    message: "user_id, account_type and initial blance are all required to create an account"
                });                
                return;
            }

            if (!Object.values(AccountType).includes(account_type)) {
                res.status(400).json({
                    message: `Invalid account type. Valid options are: ${Object.values(AccountType).join(', ')}`,
                });
                return;
            }

            const account: Account = await this.account_service.createAccount(account_type as AccountType, user_id, balance);

            res.status(201).json(account);
        } catch (err) {
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    }

    getAccountsByUserId = async (req: Request, res: Response) => {
        try {
            const user_id: string = req.params.userId;
            const accounts: Array<Account> = await this.account_service.getAccountsByUserId(user_id);

            res.status(200).json(accounts);
        } catch (err) {
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
}