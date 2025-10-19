import User from "../models/User.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";


export const getMembersByLeader = async (req, res) => {
  try {
    const { leader_id } = req.params;
    const members = await User.find({ leader_id, role: "member" });

    if (!members.length)
      return res.status(404).json({
        success: false,
        message: "No members found under this leader"
      });

    res.status(200).json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ✅ 2. Get all projects of members under a leader
 */
export const getProjectsByLeader = async (req, res) => {
  try {
    const { leader_id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(leader_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leader_id format"
      });
    }

    // Aggregation pipeline
    const projects = await User.aggregate([
      {
        $match: {
          leader_id: leader_id,
          role: { $regex: /^member$/i } // Match both "Member" or "member"
        }
      },
      {
        $addFields: {
          userIdString: { $toString: "$_id" } // convert _id to string
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "userIdString",
          foreignField: "member_id",
          as: "projects"
        }
      },
      { $unwind: "$projects" },
      { $replaceRoot: { newRoot: "$projects" } }
    ]);

    if (!projects.length) {
      return res.status(404).json({
        success: false,
        message: "No projects found under this leader"
      });
    }

    res.status(200).json({
      success: true,
      total_projects: projects.length,
      data: projects
    });
  } catch (err) {
    console.error("Error fetching leader projects:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};