import { authModel } from "../models/auth.model.js";
import { userDataModel } from "../models/userData.model.js";

export const deleteUser = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
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
