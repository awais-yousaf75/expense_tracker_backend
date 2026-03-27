import { Router } from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as expenseController from "../controllers/expense.controller.js";

const expenseRouter = Router();

/**
 * POST /api/expense/create-expense
 */
expenseRouter.post(
  "/create-expense",
  authMiddleware.authMiddleware,
  expenseController.createExpense,
);
/**
 * GET /api/expenses/get-all
 */
expenseRouter.get(
  "/get-all",
  authMiddleware.authMiddleware,
  expenseController.getExpenses,
);
/**
 * PATCH /api/expenses/update-expense/:id
 */
expenseRouter.patch(
  "/update-expense/:id",
  authMiddleware.authMiddleware,
  expenseController.updateExpense,
);
/**
 * DELETE /api/expense/delete-expense/:id
 */
expenseRouter.delete(
  "/delete-expense/:id",
  authMiddleware.authMiddleware,
  expenseController.deleteExpense,
);
export default expenseRouter;
