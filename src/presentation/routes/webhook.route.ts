import express from "express";
import { container } from "tsyringe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { WebhookService } from "../../application/services/webhook.service.js";
import { WebhookController } from "../controllers/webhook.controller.js";

const WebhookRouter = express.Router();

const account_repository = container.resolve<AccountRepository>('AccountRepository');
const transaction_repository = container.resolve<TransactionRepository>('TransactionRepository');

const webhook_service = new WebhookService(transaction_repository, account_repository);
const webhook_controller = new WebhookController(webhook_service);

WebhookRouter.post(
    '/stripe/deposit',
    express.json(),
    webhook_controller.createStripeDepositIntent.bind(webhook_controller)
);

WebhookRouter.post(
    '/webhooks/payment',
    express.raw({ type: 'application/json' }),
    webhook_controller.processStripeDeposit.bind(webhook_controller)
);

export default WebhookRouter;
