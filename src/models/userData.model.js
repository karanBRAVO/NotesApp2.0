import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    noteTitle: {
      type: Buffer,
      required: true,
    },
    noteDescription: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

export const userDataModel = new mongoose.model("userData", userDataSchema);
