import express from "express";
import {
  signupUser,
  loginUser,
  mainPage,
} from "../controllers/frontend.controller.js";

const router = express.Router();

router.get("/notes", mainPage);
router.get("/signup", signupUser);
router.get("/login", loginUser);

export default router;
