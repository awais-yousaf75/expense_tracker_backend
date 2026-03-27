import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import cookie from "cookie-parser";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookie());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API");
});

export default app;
