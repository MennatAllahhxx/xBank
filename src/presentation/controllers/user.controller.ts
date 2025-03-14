import { Request, Response } from "express";
import { UserService } from "../../application/services/user.service.js";
import { User } from "../../core/entities/user.entity.js";

export class UserController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const name: string = req.body.name;
            const email: string = req.body.email;
            const password: string = req.body.password;
            const user: User = await this.userService.createUser(name, email, password);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    updateUser = async (req:Request, res: Response) => {
        try {
            const name: string = req.body.name;
            const email: string = req.body.email;
            const password: string = req.body.password;
            const id: string = req.params.id;

            const savedUser: User | null = await this.userService.updateUser(
                id,
                name,
                email,
                password
            );            

            res.status(201).json(savedUser);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    getUserById = async (req:Request, res: Response) => {
        try {
            const user: User | null = await this.userService.getUserById(req.params.id);
            
            res.status(200).json(user);
        } catch (err: any) {
            res.status(401).json({ message: err.message });
        }
    }

    getAllUsers = async (req:Request, res: Response) => {
        try {
            const users: Array<User> = await this.userService.getAllUsers();

            res.status(200).json(users);
        } catch (err: any) {
            res.status(400).json({message: err.message});
        }
    }
}