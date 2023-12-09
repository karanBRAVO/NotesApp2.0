import express from "express";
import {
  signupUser,
  loginUser,
  mainPage,
  homePage,
} from "../controllers/frontend.controller.js";
import { isLoggedIn } from "../middlewares/authenticateUser.middleware.js";

const router = express.Router();

router.get("/", homePage);
router.get("/notes", isLoggedIn, mainPage);
router.get("/signup", signupUser);
router.get("/login", loginUser);

export default router;
