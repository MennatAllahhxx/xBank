import express from "express";
import { container } from "tsyringe";
import { AccountRepository } from "../../core/interfaces/account.repo.interface.js";
import { AccountService } from "../../application/services/account.service.js";
import { AccountController } from "../controllers/account.controller.js";
import { UserRepository } from "../../core/interfaces/user.repo.interface.js";
import { authMiddleware, isAuthorized } from "../middleware/auth.middleware.js";
import { UserRole } from "../../core/entities/user.entity.js";

const AccountRouter = express.Router();

const userRepository = container.resolve<UserRepository>('UserRepository');
const accountRepository = container.resolve<AccountRepository>('AccountRepository');
const accountService = new AccountService(accountRepository, userRepository);
const accountController = new AccountController(accountService);

// Admin routes
AccountRouter.post(
    '/accounts',
    authMiddleware,
    isAuthorized([UserRole.ADMIN]),
    accountController.createAccount.bind(accountController)
);

// Admin and support routes
AccountRouter.get(
    '/accounts/:userId',
    authMiddleware,
    isAuthorized([UserRole.ADMIN, UserRole.SUPPORT]),
    accountController.getAccountsByUserId.bind(accountController)
);

export default AccountRouter;