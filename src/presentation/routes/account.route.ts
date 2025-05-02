import express from "express";
import { container } from "tsyringe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { AccountService } from "../../application/services/account.service.js";
import { AccountController } from "../controllers/account.controller.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { authMiddleware, isAuthorized } from "../middleware/auth.middleware.js";
import { UserRole } from "../../core/entities/user.entity.js";

const AccountRouter = express.Router();

const user_repository = container.resolve<UserRepository>('UserRepository');
const account_repository = container.resolve<AccountRepository>('AccountRepository');
const account_service = new AccountService(account_repository, user_repository);
const account_controller = new AccountController(account_service);

// Admin routes
AccountRouter.post(
    '/accounts',
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    account_controller.createAccount.bind(account_controller)
);

// Admin and support routes
AccountRouter.get(
    '/accounts/:userId',
    authMiddleware,
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]),
    account_controller.getAccountsByUserId.bind(account_controller)
);

export default AccountRouter;