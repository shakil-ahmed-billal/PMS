import express from "express";
import {
  getMembersByLeader,
  getProjectsByLeader
} from "../controllers/leaderController.js";

const router = express.Router();

router.get("/:leader_id/members", getMembersByLeader);
router.get("/:leader_id/projects", getProjectsByLeader);

export default router;
