import express from "express";
import { container } from "tsyringe";
import { TransactionService } from "../../application/services/transaction.service.js";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { TransactionController } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const TransactionRouter = express.Router();

const account_repository = container.resolve<AccountRepository>('AccountRepository');
const transaction_repository = container.resolve<TransactionRepository>('TransactionRepository');

const transaction_service = new TransactionService(transaction_repository, account_repository);
const transaction_controller = new TransactionController(transaction_service);

TransactionRouter.post(
    '/transactions/transfer',
    authMiddleware,
    transaction_controller.createTransfer.bind(transaction_controller)
);

TransactionRouter.get(
    '/transactions/history',
    authMiddleware,
    transaction_controller.getTransactions.bind(transaction_controller)
);

export default TransactionRouter;
