import jwt from "jsonwebtoken";
import { authModel } from "../models/auth.model.js";

export const authenticateUser = (req, res, next) => {
  try {
    // getting token
    const token = req.cookies.token;
    // const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const err = new Error("Invalid token");
      throw err;
    }

    // decoding token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      const err = new Error("Invalid token");
      throw err;
    }

    // setting adding data to request
    req.userId = decodedToken.id;

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isLoggedIn = async (req, res, next) => {
  try {
    // getting token
    const token = req.cookies.token;
    if (!token) {
      const error = new Error('<a href="/notesapp2_0/login">Login Please</a>');
      throw error;
    }

    // verifying token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifyToken) {
      const error = new Error(
        'You must <a href="/notesapp2_0/login">Login Please</a> before getting to main page'
      );
      throw error;
    }

    // finding user in db
    const id = verifyToken.id;
    const user = await authModel.findOne({ _id: id });
    if (!user) {
      const error = new Error(
        `You must <a href="/notesapp2_0/signup">Signup Please</a> before getting to main page`
      );
      throw error;
    }

    next();
  } catch (error) {
    res.send(`<h1>You are not Logged In</h1><p>${error.message}</p>`);
  }
};
