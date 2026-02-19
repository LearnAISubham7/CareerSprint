import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTemplate,
  getMyTemplates,
  updateTemplate,
  deleteTemplate,
  toggleTemplateActive,
} from "../controllers/templateController.js";

const router = express.Router();

router.post("/", protect, createTemplate);
router.get("/", protect, getMyTemplates);
router.patch("/:id", protect, updateTemplate);
router.delete("/:id", protect, deleteTemplate);
router.patch("/:id/toggle-active", protect, toggleTemplateActive);

export default router;
