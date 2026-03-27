import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import cookie from "cookie-parser";
import userRouter from "./routes/user.route.js";
import expenseRouter from "./routes/expense.route.js";
import statRouter from "./routes/stat.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookie());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/stats", statRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API");
});

export default app;
