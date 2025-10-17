import express from "express";
import { registerUser, loginUser, getAllLeader } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/leader", getAllLeader);

export default router;
