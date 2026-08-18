import express from "express";
import { getUserProfile, getUserActivity } from "../controllers/submissionController.js";

const router = express.Router();

// ── User profile routes (public) ───────────────────────────────────────────────
router.get("/:userId/profile", getUserProfile);
router.get("/:userId/activity", getUserActivity);

export default router;
