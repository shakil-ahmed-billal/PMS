import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getUserProjects,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.get("/user/:id", getUserProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
