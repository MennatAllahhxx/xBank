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
    declare createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    declare updatedAt: Date;
}