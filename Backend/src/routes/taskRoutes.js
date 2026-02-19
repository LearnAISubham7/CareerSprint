import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getTodayTasks,
  getTasksByDate,
  createCustomTask,
  toggleTaskDone,
  startTaskTimer,
  stopTaskTimer,
  deleteTaskInstance,
  getHistory,
  updateTaskInstance,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, createCustomTask);

router.patch("/:id", protect, updateTaskInstance);
router.delete("/:id", protect, deleteTaskInstance);

router.patch("/:id/toggle", protect, toggleTaskDone);
router.post("/:id/start-timer", protect, startTaskTimer);
router.post("/:id/stop-timer", protect, stopTaskTimer);

router.get("/today", protect, getTodayTasks);
router.get("/date/:date", protect, getTasksByDate);

router.get("/history/range", protect, getHistory);

export default router;
