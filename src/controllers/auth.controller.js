import { authModel } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkDetails = (username, password) => {
  if (
    !username ||
    username.length == 0 ||
    !password ||
    password.length == 0 ||
    password.length < 6
  ) {
    return false;
  }
  return true;
};

export const signupUser = async (req, res, next) => {
  try {
    // getting the user details
    const { username, password } = req.body;
    if (!checkDetails(username, password)) {
      const err = new Error(`Invalid username or password`);
      throw err;
    }

    // checking if the user exists in the database
    const isExist = await authModel.findOne({ username });
    if (isExist) {
      const error = new Error(`User ${username} already exists`);
      throw error;
    }

    // saving the user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new authModel({
      username,
      password: hashedPassword,
    });
    await user.save();

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // checking details
    const { username, password } = req.body;
    if (!checkDetails(username, password)) {
      const err = new Error(`Invalid username or password`);
      throw err;
    }

    // finding user in database
    const user = await authModel.findOne({ username });
    if (!user) {
      const err = new Error(`User not found`);
      throw err;
    }

    // matching password
    if (!bcrypt.compareSync(password, user.password)) {
      const err = new Error(`password not match`);
      throw err;
    }

    // creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.json({ success: true, message: "Token sent", token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
