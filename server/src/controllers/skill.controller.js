import Skill from '../models/Skill.js';
import { StatusCodes } from 'http-status-codes';
import { validationResult } from 'express-validator';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ category: 1, order: 1, name: 1 });

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      const { category } = skill;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.status(StatusCodes.OK).json({
      success: true,
      count: skills.length,
      data: skillsByCategory,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while fetching skills',
    });
  }
};

// @desc    Get all skill categories
// @route   GET /api/skills/categories
// @access  Public
export const getSkillCategories = async (req, res) => {
  try {
    const categories = await Skill.distinct('category');
    res.status(StatusCodes.OK).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Get skill categories error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while fetching skill categories',
    });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const skill = await Skill.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
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
      message: 'Server error while creating skill',
    });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Skill not found',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while updating skill',
    });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Skill not found',
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error while deleting skill',
    });
  }
};
