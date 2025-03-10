import express, { Request, Response } from "express";
import { AppDataSource } from './db/database.js'; 
import dotenv from "dotenv";
import 'reflect-metadata';

dotenv.config();

AppDataSource.initialize().then(async () => {
    console.log('Database connected');

    const app = express();
    const port = process.env.PORT || 3000;

    app.get('/health', (req: Request, res: Response) => { res.status(200).send('Healthy server') });
    app.listen(port, () => console.log(`app is running on port: ${port}`));
}).catch((err: Error) => { console.log(err) });