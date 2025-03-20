import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { AuthRequest } from "../types/auth.types.js";
import { UserRole } from "../../core/entities/user.entity.js";

interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
    iat: number;
}

export const authMiddleware = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not defined');
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
        if (!decoded) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch (err: any) {
        if (err.message === 'jwt expired' || err.message === 'invalid token') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        } else {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
    
}

export const isAuthorized = (roles: UserRole[]) => {
    return async (
        req: AuthRequest, 
        res: Response, 
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            else if (!roles.includes(req.user.role)) {
                res.status(403).json({ message: 'Forbidden resource' });
                return;
            }
            else next();
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
