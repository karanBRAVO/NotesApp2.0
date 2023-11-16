import express from "express";
import dotenv from "dotenv";
import connectToDB from "./connection/db.conn.js";
import authRouter from "./routes/auth.route.js";
import userDataRouter from "./routes/userData.route.js";
import userRouter from "./routes/user.route.js";

// configuring dotenv
dotenv.config();

// connecting to database
const uri = process.env.MONGO_URI || process.env.MONGO_LOCAL_URI;
connectToDB(uri);

// creating express app
const app = express();

// setting port
const PORT = process.env.PORT || 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use("/api", authRouter);
app.use("/api", userDataRouter);
app.use("/api", userRouter);

// starting server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
