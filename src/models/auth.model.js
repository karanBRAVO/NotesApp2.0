import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const authModel = new mongoose.model("user", authSchema);
