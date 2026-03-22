import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API");
});

export default app;
