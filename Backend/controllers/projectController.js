const Project = require('../models/Project');

// @desc    Get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // --- FIX IS HERE ---
    // We send the array DIRECTLY. No 'success' wrapper, no 'data' wrapper.
    // This fixes the "map is not a function" error.
    res.status(200).json(projects); 
    // -------------------

  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true,
      }
    );
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};