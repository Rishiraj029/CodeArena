import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createAndExecuteSubmission,
  getMySubmissions,
  getSubmissionById,
  getUserProfile,
  getUserActivity,
} from "../controllers/submissionController.js";

const router = express.Router();

// ── Submission routes (auth required) ─────────────────────────────────────────
router.post("/", protectRoute, createAndExecuteSubmission);
router.get("/me", protectRoute, getMySubmissions);
router.get("/:id", protectRoute, getSubmissionById);

export default router;
