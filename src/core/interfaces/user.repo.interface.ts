import { User } from "../entities/user.entity.js";

export interface UserRepository {
    createUser(user: User): Promise<User>;
    updateUser(id: string, name?: string, email?: string, password?: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    getAllUsers(): Promise<Array<User>>;
}