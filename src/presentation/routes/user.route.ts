import express from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../../application/services/user.service.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { authMiddleware, isAuthorized } from "../middleware/auth.middleware.js";
import { UserRole } from "../../core/entities/user.entity.js";

const UserRouter = express.Router();

const user_repository = container.resolve<UserRepository>('UserRepository');
const user_service = new UserService(user_repository);
const user_controller = new UserController(user_service);

UserRouter.post('/auth/register', user_controller.createUser.bind(user_controller));
UserRouter.post('/auth/login', user_controller.login.bind(user_controller));

// Admin routes
UserRouter.post(
    '/users', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    user_controller.createUser.bind(user_controller)
);
UserRouter.put(
    '/user/:id', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    user_controller.updateUser.bind(user_controller)
);
UserRouter.get(
    '/users/role/:role', 
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    user_controller.getAllUsersByRole.bind(user_controller)
);
UserRouter.delete(
    '/user/:id', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN]), 
    user_controller.deleteUser.bind(user_controller)
);

// User routes
UserRouter.get(
    '/users/me', 
    authMiddleware, 
    isAuthorized([UserRole.USER]), 
    user_controller.getUserProfile.bind(user_controller)
);
UserRouter.put(
    '/users/me', 
    authMiddleware, 
    isAuthorized([UserRole.USER]), 
    user_controller.updateUserProfile.bind(user_controller)
);

// Support and admin routes
UserRouter.get(
    '/user/email/:email', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    user_controller.getUserByEmail.bind(user_controller)
);
UserRouter.get(
    '/user/:id', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    user_controller.getUserById.bind(user_controller)
);
UserRouter.get(
    '/users', 
    authMiddleware, 
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]), 
    user_controller.getAllUsers.bind(user_controller)
);

export default UserRouter;