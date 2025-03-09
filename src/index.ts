import { Request, Response } from "express";

const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.get('/health', (req: Request, res: Response) => res.status(200).send('Healthy server'));

app.listen(port, () => console.log('app is running on port: ', port));
