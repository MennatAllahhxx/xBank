import { Min } from "class-validator";
import { BaseEntity } from "./base.entity.js";

export enum AccountType {
    SAVINGS  = 'savings',
    CURRENT = 'current'
}

export class Account extends BaseEntity {
    userId: string;

    accountType: AccountType;

    balance: number;

    constructor(
        userId: string,
        accountType: AccountType,
        balance: number,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super();
        this.userId = userId;
        this.accountType = accountType;
        this.balance = balance;
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}