import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isExist = await userModel.findOne({
    email,
  });

  if (isExist) {
    return res.status(422).json({
      message: "User with this email already exists.",
      status: "Failed",
    });
  }

  const user = await userModel.create({ username, email, password });

  //   const refreshToken = jwt.sign(
  //     {
  //       userId: user._id,
  //     },
  //     config.JWT_SECRET,
  //     {
  //       expiresIn: "7d",
  //     },
  //   );

  //   const refreshTokenHash = await bcrypt.hash("refreshToken", 10);

  //   const accessToken = jwt.sign(
  //     {
  //       userId: user._id,
  //     },
  //     config.JWT_SECRET,
  //     {
  //       expiresIn: "7d",
  //     },
  //   );

  res.status(200).json({
    message: "User registered successfully.",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

