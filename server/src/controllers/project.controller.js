import Project from '../models/Project.js';
import { StatusCodes } from 'http-status-codes';
import { validationResult } from 'express-validator';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { featured, limit, skip = 0 } = req.query;

    const query = {};
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projectsQuery = Project.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit) || 10);

    const [projects, total] = await Promise.all([
      projectsQuery.exec(),
      Project.countDocuments(query),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      count: projects.length,
      total,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while fetching projects',
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while fetching project',
    });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const project = await Project.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while creating project',
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while updating project',
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete project error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while deleting project',
    });
  }
};
