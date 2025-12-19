const Project = require('../models/Project');

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ 
      success: true,
      count: projects.length,
      data: projects 
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.json({ 
      success: true,
      data: project 
    });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ 
      success: true,
      message: 'Project created successfully',
      data: project 
    });
  } catch (error) {
    next(error);
  }
};

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
    res.json({ 
      success: true,
      message: 'Project updated successfully',
      data: project 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.json({ 
      success: true,
      message: 'Project deleted successfully',
      data: project 
    });
  } catch (error) {
    next(error);
  }
};
