import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // project-1, project-2, etc.
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    deadline: { type: Date },
    progress: { type: Number, default: 0 }, // percentage
    member_id: { type: String, required: true }, // store member ID as string
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Project", projectSchema);
