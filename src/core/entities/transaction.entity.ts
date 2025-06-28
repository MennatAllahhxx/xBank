import { BaseEntity } from "./base.entity.js";

export enum Source {
    INTERNAL = 'internal',
    EXTERNAL = 'external'
}

export enum Status {
    PENDING = 'pending',
    FAILED = 'failed',
    COMPLETED = 'completed'
}

export enum Type {
    TRANSFER = 'transfer',
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal'
}

export class Transaction extends BaseEntity {

    account_id: string;
    amount: number;    
    source: Source;
    status: Status;
    type: Type;
    sender_account_id?: string;
    external_paymenrt_id?: string;
    payment_intent_id?: string;

    constructor(
        account_id: string,
        amount: number,
        source: Source = Source.INTERNAL,
        status: Status = Status.PENDING,
        type: Type = Type.TRANSFER,
        sender_account_id?: string,
        payment_intent_id?: string,
        id?: string,
        created_at?: Date,
        updated_at?: Date,
    ) {
        super();
        this.account_id = account_id;
        this.amount = amount;
        this.source = source;
        this.status = status;
        this.type = type;
        this.sender_account_id = sender_account_id;
        this.payment_intent_id = payment_intent_id;
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}