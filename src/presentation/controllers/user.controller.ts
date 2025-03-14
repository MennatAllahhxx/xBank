import { Request, Response } from "express";
import { UserService } from "../../application/services/user.service.js";
import { User } from "../../core/entities/user.entity.js";
import { AuthRequest } from "../types/auth.types.js";

export class UserController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const name: string = req.body.name;
            const email: string = req.body.email;
            const password: string = req.body.password;

            if (!name || !email || !password) {
                res.status(400).json({ message: "name, email and password are all required" });
            } else {
                const user: User = await this.userService.createUser(name, email, password);

                const {password: _, ...userWithoutPassword} = user;
                res.status(201).json(userWithoutPassword);
            }
        } catch (err: any) {
            if (err.message === 'Email already exists' 
                || err.message === 'Password must be at least 8 characters long' 
                || err.message === 'Invalid email format'
            ) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    updateUser = async (req:Request, res: Response) => {
        try {
            const name: string | undefined = req.body?.name;
            const email: string | undefined = req.body?.email;
            const password: string | undefined = req.body?.password;
            const id: string = req.params.id;

            const savedUser: User | null = await this.userService.updateUser(
                id,
                name,
                email,
                password
            );
            
            if (!savedUser) {
                res.status(404).json({ message: "User not found" });
            } else{
                const {password:_, ...userWithoutPassword} = savedUser;
                res.status(201).json(userWithoutPassword);
            }
        } catch (err: any) {
            if (err.message === 'Email is already used' 
                || err.message === 'Password must be at least 8 characters long' 
                || err.message === 'Invalid email format') {
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
            }

            const { token, userWithoutPassword } = await this.userService.generateAccessToken(email, password);

            const { id } = (userWithoutPassword as any);

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
            const user: User | null = await this.userService.getUserById(req.params.id);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password:_, ...userWithoutPassword} = user;
                res.status(200).json(userWithoutPassword);
            }
        } catch (err: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserProfile = async (req: AuthRequest, res: Response) => {
        try {            
            const user: User | null = await this.userService.getUserById(req.user?.id as string);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password:_, ...userWithoutPassword} = user;
                res.status(200).json(userWithoutPassword);
            }
        }
        catch (err: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getUserByEmail = async (req:Request, res: Response) => {
        try {
            const user: User | null = await this.userService.getUserByEmail(req.params.email);
            
            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                const {password: _, ...userWithoutPassword} = user;
                res.status(200).json(userWithoutPassword);
            }
        } catch (err: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllUsers = async (req:Request, res: Response) => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const users: Array<User> = await this.userService.getAllUsers(page, limit);

            const usersWithoutPassword = users.map(user => {
                const {password: _, ...userWithoutPassword} = user;
                return userWithoutPassword;
            });

            res.status(200).json(usersWithoutPassword);
        } catch (err: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}