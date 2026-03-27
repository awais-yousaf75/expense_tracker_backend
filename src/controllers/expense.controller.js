import expenseModel from "../models/expense.model.js";

export async function createExpense(req, res) {
  try {
    const { title, amount, category, notes, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        message: "Title and amount are required",
      });
    }

    const expense = await expenseModel.create({
      userId: req.user._id,
      title,
      amount,
      category,
      notes,
      date,
    });

    res.status(201).json({
      message: "Expense created",
      expense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create expense", error: error.message });
  }
}

export async function getExpenses(req, res) {
  try {
    const expenses = await expenseModel
      .find({ userId: req.user._id })
      .sort({ date: -1 });
    res.status(200).json({
      message: "All expenses of current user.",
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: error.message });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;

    const allowedFields = ["title", "amount", "category", "notes"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update",
      });
    }

    const expense = await expenseModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!expense)
      return res.status(404).json({
        message: "Expense not found",
      });

    res.status(200).json({
      message: "Expense updated",
      expense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update expense", error: error.message });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const expense = await expenseModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!expense)
      return res.status(404).json({
        message: "Expense not found",
      });
    res.status(200).json({
      message: "Expense deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expense",
      error: error.message,
    });
  }
}
