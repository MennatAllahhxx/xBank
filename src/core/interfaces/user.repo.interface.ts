import { DeleteResult } from "typeorm";
import { User, UserRole } from "../entities/user.entity.js";

export interface UserRepository {
    createUser(user: User): Promise<User>;
    updateUser(id: string, name?: string, email?: string, password?: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getAllUsers(page: number, limit: number): Promise<Array<User>>;
    getAllUsersByRole(role: UserRole): Promise<Array<User>>;
    deleteUser(id: string): Promise<DeleteResult>;
}