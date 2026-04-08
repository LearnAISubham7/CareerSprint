import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserActivity } from "../controllers/userController.js";

const router = express.Router();

router.get("/activity", protect, getUserActivity);

export default router;
