import 'reflect-metadata';
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppDataSource } from './infrastructure/db/database.js';
import './infrastructure/di.js';
import UserRouter from "./presentation/routes/user.route.js";
import AccountRouter from './presentation/routes/account.route.js';

dotenv.config();

AppDataSource.initialize().then(async () => {
    console.log('Database connected');

    const app = express();
    app.use(express.json());

    const port = process.env.PORT || 3000;

    app.get('/health', (req: Request, res: Response) => { res.status(200).send('Healthy server') });

    app.use(UserRouter);
    app.use(AccountRouter);
    
    app.listen(port, () => console.log(`app is running on port: ${port}`));
}).catch((err: Error) => { console.log(err) });