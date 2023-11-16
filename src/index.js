import express from "express";
import dotenv from "dotenv";
import connectToDB from "./connection/db.conn.js";

// configuring dotenv
dotenv.config();

// connecting to database
const uri = process.env.MONGO_URI || process.env.MONGO_LOCAL_URI;
connectToDB(uri);

// creating express app
const app = express();

// setting port
const PORT = process.env.PORT || 3000;

// starting server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
