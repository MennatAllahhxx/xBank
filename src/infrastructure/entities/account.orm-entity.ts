import { Column, Entity } from "typeorm";
import { BaseOrmEntity } from "./base.orm-entity.js";
import { Account, AccountType } from "../../core/entities/account.entity.js";

@Entity()
export class AccountOrmEntity extends BaseOrmEntity implements Account {
    @Column({ type: 'varchar', length: 100 })
    accountType!: AccountType;

    @Column({ type: 'double precision'})
    balance!: number;

    @Column({ type: 'uuid' })
    userId!: string;
}