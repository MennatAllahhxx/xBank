import 'reflect-metadata';
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppDataSource } from './infrastructure/db/database.js';
import './infrastructure/di.js';
import UserRouter from "./presentation/routes/user.route.js";
import AccountRouter from './presentation/routes/account.route.js';
import TransactionRouter from './presentation/routes/transaction.route.js';
import WebhookRouter from './presentation/routes/webhook.route.js';
import helmetConfig from './presentation/middleware/security.middleware.js';
import rateLimiterConfig from './presentation/middleware/rate-limiter.middleware.js';

dotenv.config();

AppDataSource.initialize().then(async () => {
    console.log('Database connected');
    const port = process.env.PORT || 3000;

    const app = express();

    app.use(helmetConfig);
    app.use(rateLimiterConfig);

    app.use(WebhookRouter);
    app.use(express.json());
    app.use(UserRouter);
    app.use(AccountRouter);
    app.use(TransactionRouter);

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).send('Healthy server')
    });

    app.listen(port, () => console.log(`app is running on port: ${port}`));
}).catch((err: Error) => { console.log(err) });