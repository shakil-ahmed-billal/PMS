import express from "express";
import { getLeaderStats } from "../controllers/leaderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isLeader } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, isLeader, getLeaderStats);

export default router;
