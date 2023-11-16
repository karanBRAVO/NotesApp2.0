import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    // getting token
    const token = req.headers.authorization.split(" ")[1];
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
