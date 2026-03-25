import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

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
/**
 * POST /api/auth/logout
 */
authRouter.post("/logout", authController.logout);
/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", authMiddleware.authMiddleware, authController.get_me);

/**
 * GET /api/auth/protected
 */
authRouter.get("/protected", authMiddleware.authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

export default authRouter;
