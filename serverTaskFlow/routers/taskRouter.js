import express from "express";
import {
  createTask,
  getAllTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:project_id", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
