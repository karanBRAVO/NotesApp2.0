import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectToDB from "./connection/db.conn.js";
import authRouter from "./routes/auth.route.js";
import userDataRouter from "./routes/userData.route.js";
import userRouter from "./routes/user.route.js";
import frontEndRouter from "./routes/frontend.route.js";

// configuring dotenv
dotenv.config();

// connecting to database
const uri = process.env.MONGO_URI || process.env.MONGO_LOCAL_URI;
connectToDB(uri);

// creating express app
const app = express();

// setting port
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setting static folder
const staticFolder = path.join(__dirname, "../public");
app.use(express.static(staticFolder));

// setting view engine
const viewFolder = path.join(__dirname, "../views");
app.set("views", viewFolder);
app.set("view engine", "hbs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", authRouter);
app.use("/api", userDataRouter);
app.use("/api", userRouter);
app.use("/notesapp2_0", frontEndRouter);

// starting server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
