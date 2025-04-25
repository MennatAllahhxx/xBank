import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Transaction } from "../../core/entities/transaction.entity.js";
import { BaseOrmEntity } from "./base.orm-entity.js";
import { AccountOrmEntity } from "./account.orm-entity.js";

@Entity()
export class TransactionOrmEntity extends BaseOrmEntity implements Transaction {
    @Column({ type: 'uuid' })
    @ManyToOne(()=> AccountOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_account_id' })
    sender_account_id!: string;

    @Column({ type: 'uuid' })
    @ManyToOne(()=> AccountOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiver_account_id' })
    receiver_account_id!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    amount!: number;
}