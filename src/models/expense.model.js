import mongoose from "mongoose";
import userModel from "./user.model.js";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["Food", "Travel", "Bills", "Shopping", "Other"],
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const expenseModel = mongoose.model("Expense", expenseSchema);

export default expenseModel;
