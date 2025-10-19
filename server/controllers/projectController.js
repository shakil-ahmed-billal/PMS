import Project from "../models/Project.js";

// 🟢 Create new project
export const createProject = async (req, res) => {
  try {
    const { id, title, description, amount, status, deadline, progress, member_id } = req.body;

    // Validate required fields
    if (!id || !title || !member_id) {
      return res.status(400).json({ message: "id, title, and member_id are required." });
    }

    const exist = await Project.findOne({ id });
    if (exist) {
      return res.status(400).json({ message: "Project ID already exists." });
    }

    const project = await Project.create({
      id,
      title,
      description,
      amount,
      status,
      deadline,
      progress,
      member_id,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟡 Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Get a project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟣 Update a project
export const updateProject = async (req, res) => {
  try {
    const updates = req.body;
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔴 Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get user projects
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ member_id: req.params.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
