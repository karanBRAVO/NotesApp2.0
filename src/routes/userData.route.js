import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.middleware.js";
import {
  getUserNote,
  addUserNote,
  updateUserNote,
  deleteUserNote,
} from "../controllers/userData.controller.js";

const router = express.Router();

router.get("/get-user-note", authenticateUser, getUserNote);
router.post("/add-user-note", authenticateUser, addUserNote);
router.put("/update-user-note", authenticateUser, updateUserNote);
router.delete("/delete-user-note", authenticateUser, deleteUserNote);

export default router;
