import Stripe from "stripe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { TransactionRepository } from "../../core/interfaces/transaction.repo.interface.js";
import { Source, Status, Transaction, Type } from "../../core/entities/transaction.entity.js";

export class WebhookService {
    private stripe: Stripe;

    constructor(
        private readonly transaction_repo: TransactionRepository,
        private readonly account_repo: AccountRepository
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    }

    async createAndConfirmStripeDepositIntent(amount: number, currency: string, account_id: string) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: 'pm_card_visa',
            confirm: true,
            payment_method_types: ['card'],
            metadata: { account_id }
        });

        return paymentIntent;
    }

    private verifyStripeSignature(raw_body: Buffer, signature: string) {
        try {
            return this.stripe.webhooks.constructEvent(
                raw_body as Buffer,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );
        } catch (err: any) {
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    async processStripeDeposit(raw_body: Buffer, signature: string) {
        const event = this.verifyStripeSignature(raw_body, signature);

        if (event.type !== 'payment_intent.succeeded') {
            return { processed: false, message: 'Event type not supported' };
        }

        const payment_intent = event.data.object as Stripe.PaymentIntent;
        const account_id = payment_intent.metadata.account_id;
        
        const existing_trx = await this.transaction_repo.getTransactionByPaymentIntentId(payment_intent.id);

        if (existing_trx) {
            return { processed: false, message: 'Transaction already exists' };
        }

        const transaction = new Transaction(
            account_id,
            payment_intent.amount / 100,
            Source.EXTERNAL,
            Status.PENDING,
            Type.DEPOSIT,
            undefined,
            payment_intent.id
        );

        await this.transaction_repo.createTransaction(transaction);

        try {
            await this.account_repo.updateAccountBalanceAfterDeposit(
                account_id,
                payment_intent.amount / 100
            );

            await this.transaction_repo.updateTransactionStatus(
                transaction.getId() as string,
                Status.COMPLETED
            );

            return { processed: true, message: 'Transaction processed successfully' };
        } catch (err: any) {
            console.error('Error processing transaction:', err);
            await this.transaction_repo.updateTransactionStatus(
                transaction.getId() as string,
                Status.FAILED
            );
            return { processed: false, message: 'Failed to process transaction' };
        }
    }
}