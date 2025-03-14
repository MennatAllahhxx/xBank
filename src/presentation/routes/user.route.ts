import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserTypeOrmRepository } from "../../infrastructure/repositories/user.typeorm.repo.js";
import { UserService } from "../../application/services/user.service.js";
import { AppDataSource } from "../../infrastructure/db/database.js";

const UserRouter = express.Router();

const userRepository = new UserTypeOrmRepository(AppDataSource);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/user', userController.createUser.bind(userController));
UserRouter.put('/user/:id', userController.updateUser.bind(userController));
UserRouter.get('/user/email/:email', userController.getUserByEmail.bind(userController));
UserRouter.get('/user/:id', userController.getUserById.bind(userController));
UserRouter.get('/users', userController.getAllUsers.bind(userController));

export default UserRouter;