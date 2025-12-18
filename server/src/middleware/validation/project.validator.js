import { body, param } from 'express-validator';

export const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot be more than 2000 characters'),

  body('techStack')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Tech stack must be an array'),

  body('techStack.*').isString().trim().withMessage('Each tech stack item must be a string'),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid GitHub URL')
    .matches(/^https?:\/\/github\.com\//)
    .withMessage('Must be a valid GitHub repository URL'),

  body('liveUrl').optional({ checkFalsy: true }).isURL().withMessage('Please provide a valid URL'),

  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean value'),

  body('tags').optional({ checkFalsy: true }).isArray().withMessage('Tags must be an array'),

  body('tags.*').isString().trim().withMessage('Each tag must be a string'),
];

export const projectIdValidation = [param('id').isMongoId().withMessage('Invalid project ID')];

export const projectQueryValidation = [
  param('featured').optional().isBoolean().withMessage('Featured must be a boolean value'),

  param('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  param('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a positive number or zero'),
];

export const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({
      success: false,
      errors: extractedErrors,
    });
  };
};
