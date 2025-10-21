import express from "express";
import {
  getMembersByLeader,
  getProjectsByLeader,
  loadMemberDetails
} from "../controllers/leaderController.js";

const router = express.Router();

router.get("/:leader_id/members", getMembersByLeader);
router.get("/:leader_id/projects", getProjectsByLeader);
// Define the route to fetch member details
router.get('/:leaderId/members/:memberId/details', loadMemberDetails);


export default router;
