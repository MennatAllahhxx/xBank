import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req: Request, res: Response) => { res.status(200).send('Healthy server') });

app.listen(port, () => console.log(`app is running on port: ${port}`));
