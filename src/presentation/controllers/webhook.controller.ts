import { Request, Response } from "express";
import { WebhookService } from "../../application/services/webhook.service.js";

export class WebhookController {
    constructor(private webhook_service: WebhookService) {
        this.webhook_service = webhook_service;
    }

    createStripeDepositIntent = async (req: Request, res: Response) => {
        try {
            const { amount, currency, account_id } = req.body;

            if (!amount || !currency || !account_id) {
                res.status(400).json({ message: 'Missing required fields' });
            }

            const paymentIntent = await this.webhook_service.createAndConfirmStripeDepositIntent(
                amount,
                currency,
                account_id
            );

            res.status(201).json({ message: 'PaymentIntent created & confirmed', paymentIntent });
        } catch (error: any) {
            console.error('Failed to create Stripe deposit:', error.message);
            res.status(500).json({ message: 'Stripe deposit failed' });
        }
    };

    processStripeDeposit = async (req: Request, res: Response) => {
        const signature = req.headers['stripe-signature'] as string;
        const raw_body = req.body;
        
        try {
            const result = await this.webhook_service.processStripeDeposit(raw_body as Buffer, signature);            
            res.status(201).json(result);
        } catch (err: any) {
            console.log('Error handling deposit: ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}