import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role, leader_id } = req.body;

  console.log(req.body)
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role , leader_id });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err)
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    

    res.json({user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all leader
export const getAllLeader = async (req, res) => {
  try {
    const users = await User.find({ role: "Leader" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
