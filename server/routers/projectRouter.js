// routers/projectRouter.js
const express = require('express');
const { getAllProjects, createProject, updateProject } = require('../controllers/projectController');
const router = express.Router();

// Routes
router.get('/projects', getAllProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);

module.exports = router;
