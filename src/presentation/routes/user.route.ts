import express from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../../application/services/user.service.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { authMiddleware, isAuthorized } from "../middleware/auth.middleware.js";
import { UserRole } from "../../core/entities/user.entity.js";

const UserRouter = express.Router();

const userRepository = container.resolve<UserRepository>('UserRepository');
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/auth/register', userController.createUser.bind(userController));
UserRouter.post('/auth/login', userController.login.bind(userController));

// Admin routes
UserRouter.post(
    '/users', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    userController.createUser.bind(userController)
);
UserRouter.put(
    '/user/:id', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    userController.updateUser.bind(userController)
);
UserRouter.get(
    '/users/role/:role', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    userController.getAllUsersByRole.bind(userController)
);
UserRouter.delete(
    '/user/:id', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN]), 
    userController.deleteUser.bind(userController)
);

// User routes
UserRouter.get(
    '/users/me', 
    authMiddleware, 
    isAuthorized([UserRole.USER]), 
    userController.getUserProfile.bind(userController)
);
UserRouter.put(
    '/users/me', 
    authMiddleware, 
    isAuthorized([UserRole.USER]), 
    userController.updateUserProfile.bind(userController)
);

// Support and admin routes
UserRouter.get(
    '/user/email/:email', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    userController.getUserByEmail.bind(userController)
);
UserRouter.get(
    '/user/:id', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    userController.getUserById.bind(userController)
);
UserRouter.get(
    '/users', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    userController.getAllUsers.bind(userController)
);

export default UserRouter;