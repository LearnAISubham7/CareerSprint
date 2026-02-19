import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ check current logged in user
router.get("/me", protect, getMe);

// logout should be protected (optional)
router.post("/logout", protect, logoutUser);

export default router;
