import { 
    Entity, 
    Column
} from 'typeorm';
import { User } from '../../core/entities/user.entity.js';
import { BaseOrmEntity } from './base.orm-entity.js';

@Entity()
export class UserOrmEntity extends BaseOrmEntity implements User {
    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar', select: false })
    password!: string;
}