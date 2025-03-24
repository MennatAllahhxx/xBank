import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseOrmEntity } from "./base.orm-entity.js";
import { Account, AccountType } from "../../core/entities/account.entity.js";
import { UserOrmEntity } from "./user.orm-entity.js";

@Entity()
export class AccountOrmEntity extends BaseOrmEntity implements Account {
    @Column({ type: 'varchar', length: 100, default: AccountType.CURRENT })
    account_type!: AccountType;

    @Column({ type: 'double precision'})
    balance!: number;

    @Column({ type: 'uuid' })
    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user_id!: string;
}