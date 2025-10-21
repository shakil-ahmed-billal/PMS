import User from "../models/User.js";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";


export const getMembersByLeader = async (req, res) => {
  try {
    const { leader_id } = req.params;
    const members = await User.find({ leader_id, role: "Member" });

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

export const getMembersWithStats = async (req, res) => {
  try {
    // Get all members (who have 'Member' role)
    const members = await User.find({ role: 'Member' });

    // Map each member and calculate their project stats
    const membersWithStats = await Promise.all(members.map(async (member) => {
      // Find projects associated with the member
      const projects = await Project.find({ member_id: member._id });
      
      // Calculate the stats
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const totalAmount = projects.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      return {
        ...member.toObject(),
        projectCount: projects.length,
        completedProjects,
        totalAmount
      };
    }));

    res.status(200).json(membersWithStats);
  } catch (error) {
    console.error('Error fetching members with stats:', error);
    res.status(500).json({ error: 'An error occurred while fetching member data.' });
  }
};

// Controller function to load member details
export const loadMemberDetails = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    // Fetch member data
    const member = await User.findById(memberId).populate('leader_id');

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fetch related projects for the member
    const projects = await Project.find({ member_id: memberId });

    // Fetch related tasks for each project
    const allTasks = [];
    for (let project of projects) {
      const tasks = await Task.find({ project_id: project.id });
      allTasks.push(...tasks);
    }

    // Calculate stats for the member
    const stats = {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      inProgressProjects: projects.filter(p => p.status === 'in_progress' || p.status === 'pending').length,
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      totalAmount: projects.reduce((sum, p) => sum + p.amount, 0),
      completedAmount: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      averageProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0
    };

    res.json({
      success: true,
      member,
      projects,
      tasks: allTasks,
      stats
    });
  } catch (error) {
    console.error('Error loading member details:', error);
    res.status(500).json({ success: false, message: 'Error loading member details' });
  }
};