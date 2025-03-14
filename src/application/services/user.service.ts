import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { User } from "../../core/entities/user.entity.js";
import { hash } from "bcryptjs";

export class UserService {
    constructor(private readonly userRepo: UserRepository){}

    async createUser(name: string, email: string, password: string) {
        const user = new User(
            name,
            email,
            await hash(password, 8)
        );
        return this.userRepo.createUser(user);
    }

    async updateUser(id: string, name?: string, email?: string, password?: string) {

        return this.userRepo.updateUser(
            id,
            name,
            email,
            password?await hash(password, 8):undefined
        );
    }

    async getUserById(id: string) {
        return this.userRepo.getUserById(id);
    }

    async getAllUsers() {
        return this.userRepo.getAllUsers();
    }
}