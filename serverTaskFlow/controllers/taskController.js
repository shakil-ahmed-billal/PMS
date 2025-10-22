import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Task created successfully", data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Tasks by Project ID
export const getTasksByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    const tasks = await Task.find({ project_id });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate({ id }, req.body, { new: true });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully", data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ id });
    if (!task)
      return res.status(404).json({ success: false, message: "Task not found" });
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * 🟢 Get All Projects + Tasks for a Specific Member (Minimal Data)
 * GET /api/tasks/member/:memberId
 */
export const getOnlyTasksByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Step 1: Find all project IDs for this member
    const memberProjects = await Project.find({ member_id: memberId }).select("id");

    if (!memberProjects.length) {
      return res.status(404).json({
        success: false,
        message: "No projects found for this member"
      });
    }

    // Step 2: Extract project IDs
    const projectIds = memberProjects.map((p) => p.id);

    // Step 3: Find all tasks that belong to these projects
    const tasks = await Task.find({ project_id: { $in: projectIds } })
      .select("id title description status priority deadline project_id -_id");

    if (!tasks.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this member’s projects"
      });
    }

    // Step 4: Return only the task data
    res.status(200).json({
      success: true,
      total_tasks: tasks.length,
      tasks
    });
  } catch (err) {
    console.error("Error fetching member tasks:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
