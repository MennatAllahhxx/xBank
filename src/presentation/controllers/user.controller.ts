import { Request, Response } from "express";
import { UserService } from "../../application/services/user.service.js";
import { User, UserRole } from "../../core/entities/user.entity.js";
import { AuthRequest } from "../types/auth.types.js";

export class UserController {
    constructor(private user_service: UserService) {
        this.user_service = user_service;
    }

    createUser = async (req: AuthRequest, res: Response) => {
        try {
            const user_role: UserRole = req.user?.role as UserRole;

            const name: string = req.body.name;
            const email: string = req.body.email;
            const password: string = req.body.password;
            let role;


            if (!name || !email || !password) {
                res.status(400).json({ message: "name, email and password are all required" });
                return;
            }

            if (user_role !== UserRole.ADMIN) {
                role = UserRole.USER;
            } else {
                role = req.body.role;
                if (!role) {
                    res.status(400).json({ message: "role is required" });
                    return;
                }

                if (!Object.values(UserRole).includes(role)) {
                    res.status(400).json({
                        message: `Invalid user role. Valid options are: ${Object.values(UserRole).join(', ')}`,
                    });
                    return;
                }
            }
            
            const user: User = await this.user_service.createUser(name, email, password, role as UserRole);
            const {password: _, ...user_without_password} = user;

            res.status(201).json(user_without_password);
        } catch (err: any) {
            if (
                err.message === 'Email already exists' ||
                err.message === 'Password must be at least 8 characters long' ||
                err.message === 'Invalid email format'
            ) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    updateUser = async (req: Request, res: Response) => {
        try {
            const name: string | undefined = req.body?.name;
            const email: string | undefined = req.body?.email;
            const password: string | undefined = req.body?.password;
            const id: string = req.params.id;

            const saved_user: User | null = await this.user_service.updateUser(
                id,
                name,
                email,
                password
            );
            
            if (!saved_user) {
                res.status(404).json({ message: "User not found" });
            } else{
                const {password:_, ...user_without_password} = saved_user;

                res.status(201).json(user_without_password);
            }
        } catch (err: any) {
            if (err.message === 'Email is already used' ||
                err.message === 'Password must be at least 8 characters long' ||
                err.message === 'Invalid email format'
            ) {
                    res.status(400).json({ message: err.message });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
        }
    }

    updateUserProfile = async (req: AuthRequest, res: Response) => {
        try {
            const name: string | undefined = req.body?.name;
            const email: string | undefined = req.body?.email;
            const password: string | undefined = req.body?.password;
            const id: string = req.user?.id as string;

            const saved_user: User | null = await this.user_service.updateUser(
                id,
                name,
                email,
                password
            );
            
            if (!saved_user) {
                res.status(404).json({ message: "User not found" });
            } else{
                const {password:_, ...user_without_password} = saved_user;
                
                res.status(201).json(user_without_password);
            }
        } catch (err: any) {
            if (err.message === 'Email is already used' ||
                err.message === 'Password must be at least 8 characters long' ||
                err.message === 'Invalid email format'
            ) {
                    res.status(400).json({ message: err.message });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }

            const { token, user_without_password } = await this.user_service.generateAccessToken(email, password);
            const { id } = (user_without_password as any);

            res.status(201).json({ access_token: token, user_id: id });
        } catch (err: any) {
            if (err.message === 'Email is not registered' || err.message === 'Invalid password') {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    getUserById = async (req: Request, res: Response) => {
        try {
            const user: User | null = await this.user_service.getUserById(req.params.id);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password:_, ...user_without_password} = user;

                res.status(200).json(user_without_password);
            }
        } catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserProfile = async (req: AuthRequest, res: Response) => {
        try {            
            const user: User | null = await this.user_service.getUserById(req.user?.id as string);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password:_, ...user_without_password} = user;

                res.status(200).json(user_without_password);
            }
        }
        catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserByEmail = async (req: Request, res: Response) => {
        try {
            const user: User | null = await this.user_service.getUserByEmail(req.params.email);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password: _, ...user_without_password} = user;

                res.status(200).json(user_without_password);
            }
        } catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const users: Array<User> = await this.user_service.getAllUsers(page, limit);

            const usersWithoutPassword = users.map(user => {
                const {password: _, ...user_without_password} = user;
                return user_without_password;
            });

            res.status(200).json(usersWithoutPassword);
        } catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllUsersByRole = async (req: Request, res: Response) => {
        try {
            const users: Array<User> = await this.user_service.getAllUsersByRole(req.params.role as UserRole);

            const users_without_password = users.map(user => {
                const {password: _, ...user_without_password} = user;
                return user_without_password;
            });

            res.status(200).json(users_without_password);
        } catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            const deleted_result = await this.user_service.deleteUser(req.params.id);
            if (deleted_result.affected === 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({ message: "User deleted successfully" });
            }
        } catch (_) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}