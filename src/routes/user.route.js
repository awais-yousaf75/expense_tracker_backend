import { Router } from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const userRouter = Router();

/**
 * GET /api/user/
 */
userRouter.get("/", authMiddleware.isAdmin, userController.getAllUsers);
/**
 * DELETE /api/user/delete-user/:id
 */
userRouter.delete(
  "/delete-user/:id",
  authMiddleware.isAdmin,
  userController.deleteUser,
);
/**
 * PATCH /api/user/update-role/:id/role
 */
userRouter.patch(
  "/update-role/:id/role",
  authMiddleware.isAdmin,
  userController.updateUserRole,
);

export default userRouter;
