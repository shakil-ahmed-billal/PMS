import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Leader", "Member"], default: "Member" },
  leader_id: { type: String }, // link member to leader
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
