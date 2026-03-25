import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt";
import blacklistModel from "../models/blacklist.model.js";

export async function registerUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        message: "User with this email already exists.",
        status: "Failed",
      });
    }

    const user = await userModel.create({ username, email, password, role });

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordConfirmed = await user.comparePassword(password);

    if (!isPasswordConfirmed) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "User logged in successfully.",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found.",
      });
    }

    // check blacklist
    const isBlackListed = await blacklistModel.findOne({ token: refreshToken });

    if (isBlackListed) {
      return res.status(401).json({
        message: "Token is blacklisted. Please login again.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // rotate (blacklist old one)
    await blacklistModel.create({ token: refreshToken });

    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed successfully.",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({
        message: "Refresh token not found.",
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    await blacklistModel.create({ token });

    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
}

export async function get_me(req, res) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({
        message: "Token not found.",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    res.status(200).json({
      message: "User found.",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Get-me failed.",
      error: error.message,
    });
  }
}
