import express from "express";
import { signupUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/signup", signupUser);
router.post("/auth/login", loginUser);

export default router;
