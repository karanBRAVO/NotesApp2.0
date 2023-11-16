import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.middleware.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.delete("/auth/delete-user", authenticateUser, deleteUser);

export default router;
