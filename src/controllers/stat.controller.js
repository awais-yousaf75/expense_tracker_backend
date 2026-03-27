import userModel from "../models/user.model.js";
import expenseModel from "../models/expense.model.js";

export async function getTotalBalance(req, res) {
  try {
    res.status(200).json({
      balance: req.user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getTotalExpenses(req, res) {
  try {
    const result = await expenseModel.aggregate([
      {
        $match: {
          userId: req.user._id,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);
    res.status(200).json({
      totalExpenses: result[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCategoryStats(req, res) {
  try {
    const result = await expenseModel.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      categoryStats: result, 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
