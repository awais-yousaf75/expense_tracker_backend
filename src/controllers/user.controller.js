import userModel from "../models/user.model.js";

export async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel
      .find(searchQuery)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await userModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      message: "Users fetched successfully",
      currentPage: page,
      totalPages,
      totalUsers,
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        message: "Admin cannot delete himself",
      });
    }
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select("-password");

    res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
