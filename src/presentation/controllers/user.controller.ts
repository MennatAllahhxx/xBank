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
}