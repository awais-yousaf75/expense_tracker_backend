import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 */
authRouter.post("/register", authController.registerUser);
/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginUser);
/**
 * POST /api/auth/refresh-token
 */
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
