// controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('member_id');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, amount, status, deadline, progress, member_id } = req.body;
    
    const newProject = new Project({
      title,
      description,
      amount,
      status,
      deadline,
      progress,
      member_id,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount, status, deadline, progress } = req.body;
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, amount, status, deadline, progress, updated_at: Date.now() },
      { new: true }
    );
    
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

module.exports = { getAllProjects, createProject, updateProject };
