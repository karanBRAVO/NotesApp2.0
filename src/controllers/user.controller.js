import { authModel } from "../models/auth.model.js";
import { userDataModel } from "../models/userData.model.js";
import bcrypt from "bcrypt";

export const getPublicKey = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Not authenticated");
      throw err;
    }

    // finding the user
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User Not found");
      throw err;
    }

    // getting the public key
    const publicKey = user.publicKey;
    const base64publicKey = publicKey.toString("base64");

    res.json({
      success: true,
      message: "Public Key found",
      publicKey: base64publicKey,
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    const { password } = req.body;
    if (password.length == 0) {
      const err = new Error("Invalid password");
      throw err;
    }

    // finding the user
    const user = await authModel.findOne({ _id: req.userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // matching the password
    if (!bcrypt.compareSync(password, user.password)) {
      const err = new Error(`password not match`);
      throw err;
    }

    // deleting user
    await authModel.deleteOne({ _id: req.userId });

    // deleting the notes
    await userDataModel.deleteMany({ userId: req.userId });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
