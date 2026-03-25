import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: [true, "Token must be unique"],
    },
  },
  {
    timestamps: true,
  },
);

blacklistSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3,
  },
);

const blacklistModel = new mongoose.model("BlackList", blacklistSchema);

export default blacklistModel;
