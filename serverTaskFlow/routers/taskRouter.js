import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getOnlyTasksByMember,
  getTasksByProject,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:project_id", getTasksByProject);
router.get("/member/:memberId/only", getOnlyTasksByMember);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
