import { 
    Entity, 
    Column
} from 'typeorm';
import { User } from '../../core/entities/user.entity.js';
import { BaseOrmEntity } from './base.orm-entity.js';

@Entity()
export class UserOrmEntity extends BaseOrmEntity implements User {
    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', unique: true, length: 100 })
    email!: string;

    @Column({ type: 'varchar', select: false, length: 100 })
    password!: string;
}