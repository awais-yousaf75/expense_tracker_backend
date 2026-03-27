import { Router } from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as statController from "../controllers/stat.controller.js";

const statRouter = Router();

/**
 * GET /api/stats/get-balance
 */
statRouter.get(
  "/get-balance",
  authMiddleware.authMiddleware,
  statController.getTotalBalance,
);
/**
 * GET /api/stats/get-total-expenses
 */
statRouter.get(
  "/get-total-expenses",
  authMiddleware.authMiddleware,
  statController.getTotalExpenses,
);
/**
 * GET /api/stats/get-category-wise-expenses
 */
statRouter.get(
  "/get-category-wise-expenses",
  authMiddleware.authMiddleware,
  statController.getCategoryStats,
);

export default statRouter;
