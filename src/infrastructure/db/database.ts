import { DataSource } from "typeorm";
import dotenv from "dotenv";
import 'reflect-metadata';

dotenv.config();

if (!process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD || !process.env.POSTGRES_DB) {
    throw new Error('Missing required database environment variables');
}

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: process.env.NODE_ENV !== 'production',
    entities: isProduction 
        ? ["dist/**/*.orm-entity.js"]
        : ["src/**/*.orm-entity.ts"],
    migrations: ['dist/infrastructure/db/migrations/**/*.js'],
    migrationsRun: true,
    migrationsTableName: 'migrations'
});
