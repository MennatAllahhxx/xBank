import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { AuthRequest } from "../types/auth.types.js";

interface JwtPayload {
    id: string;
    email: string;
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

        req.user = { id: decoded.id, email: decoded.email };
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
