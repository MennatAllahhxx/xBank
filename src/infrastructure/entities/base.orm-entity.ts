import { 
    PrimaryGeneratedColumn, 
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity.js';

export abstract class BaseOrmEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    declare id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    declare created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    declare updated_at: Date;
}