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
