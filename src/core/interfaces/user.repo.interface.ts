import { User } from "../entities/user.entity.js";

export interface UserRepository {
    createUser(user: User): Promise<User>;
    updateUser(id: string, name?: string, email?: string, password?: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getAllUsers(page: number, limit: number): Promise<Array<User>>;
}