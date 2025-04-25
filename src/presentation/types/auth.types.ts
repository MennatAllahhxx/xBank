import { Request } from 'express';
import { UserRole } from '../../core/entities/user.entity.js';

export interface AuthRequest extends Request {
    user?: { id: string; email: string, role: UserRole };
}