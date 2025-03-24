import { BaseEntity } from "./base.entity.js";

export enum AccountType {
    SAVINGS  = 'savings',
    CURRENT = 'current'
}

export class Account extends BaseEntity {
    user_id: string;

    account_type: AccountType;

    balance: number;

    constructor(
        user_id: string,
        account_type: AccountType,
        balance: number,
        id?: string,
        created_at?: Date,
        updated_at?: Date
    ) {
        super();
        this.user_id = user_id;
        this.account_type = account_type;
        this.balance = balance;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}