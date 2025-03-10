import { DataSource } from "typeorm";
import dotenv from "dotenv";
import 'reflect-metadata';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.POSTGRES_PORT||'5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: true,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/db/migrations/**/*.ts'],
    migrationsRun: true,
    migrationsTableName: 'migrations'
});
