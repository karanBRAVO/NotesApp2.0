import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.middleware.js";
import { getPublicKey, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get-user-public-key", authenticateUser, getPublicKey);
router.delete("/auth/delete-user", authenticateUser, deleteUser);

export default router;
