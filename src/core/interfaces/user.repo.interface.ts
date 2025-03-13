import { User } from "../entities/user.entity.js";

export interface UserRepository {
    // findById(id: string): Promise<User | null>;
    // findAllUsers(): Promise<[User]>;
    createUser(user: User): Promise<User>;
    // updateUser(user: User): Promise<User>;
}