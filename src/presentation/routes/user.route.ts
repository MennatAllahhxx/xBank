import express from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../../application/services/user.service.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
;

const UserRouter = express.Router();

const userRepository = container.resolve<UserRepository>('UserRepository');
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/auth/register', userController.createUser.bind(userController));
UserRouter.post('/auth/login', userController.login.bind(userController));
UserRouter.put('/user/:id', userController.updateUser.bind(userController));
UserRouter.get('/user/email/:email', userController.getUserByEmail.bind(userController));
UserRouter.get('/user/:id', userController.getUserById.bind(userController));
UserRouter.get('/users', userController.getAllUsers.bind(userController));

export default UserRouter;