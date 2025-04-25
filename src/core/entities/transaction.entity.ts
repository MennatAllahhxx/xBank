import { BaseEntity } from "./base.entity.js";

export class Transaction extends BaseEntity {
    sender_account_id: string;

    receiver_account_id: string;

    amount: number;

    constructor(
        sender_account_id: string,
        receiver_account_id: string,
        amount: number,
        id?: string,
        created_at?: Date,
        updated_at?: Date
    ) {
        super();
        this.sender_account_id = sender_account_id;
        this.receiver_account_id = receiver_account_id;
        this.amount = amount;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}