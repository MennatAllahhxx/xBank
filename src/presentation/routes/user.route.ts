import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserTypeOrmRepository } from "../../infrastructure/repositories/user.typeorm.repo.js";
import { UserService } from "../../application/services/user.service.js";
import { AppDataSource } from "../../infrastructure/db/database.js";

const UserRouter = express.Router();

const userRepository = new UserTypeOrmRepository(AppDataSource);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/user', userController.createUser);
UserRouter.put('/user/:id', userController.updateUser);
UserRouter.get('/user/:id', userController.getUserById);
UserRouter.get('/users', userController.getAllUsers);

export default UserRouter;