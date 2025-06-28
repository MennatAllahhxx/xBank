import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Source, Status, Transaction, Type } from "../../core/entities/transaction.entity.js";
import { BaseOrmEntity } from "./base.orm-entity.js";
import { AccountOrmEntity } from "./account.orm-entity.js";

@Entity()
export class TransactionOrmEntity extends BaseOrmEntity implements Transaction {
    @Column({ type: 'uuid' })
    @ManyToOne(()=> AccountOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
    account_id!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    amount!: number;

    @Column({ type: 'varchar', default: Source.INTERNAL })
    source!: Source;

    @Column({ type: 'varchar', default: Status.PENDING })
    status!: Status;

    @Column({ type: 'varchar', default: Type.TRANSFER })
    type!: Type;

    @Column({ type: 'uuid', nullable: true })
    @ManyToOne(()=> AccountOrmEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'sender_account_id' })
    sender_account_id?: string;

    @Column({ type: 'varchar', nullable: true })
    payment_intent_id?: string;
}