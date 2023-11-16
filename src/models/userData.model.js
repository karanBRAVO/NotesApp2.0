import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    noteTitle: {
      type: String,
      required: true,
    },
    noteDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const userDataModel = new mongoose.model("userData", userDataSchema);
