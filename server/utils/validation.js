const Joi = require('joi');

const bugValidationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  status: Joi.string()
    .valid('open', 'in-progress', 'resolved')
    .default('open'),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .default('medium'),
  
  assignee: Joi.string()
    .trim()
    .max(50)
    .allow('')
    .messages({
      'string.max': 'Assignee name cannot exceed 50 characters'
    }),
  
  reporter: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Reporter name is required',
      'string.min': 'Reporter name must be at least 2 characters long',
      'string.max': 'Reporter name cannot exceed 50 characters'
    })
});

const validateBug = (bugData) => {
  return bugValidationSchema.validate(bugData, { abortEarly: false });
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  validateBug,
  sanitizeInput,
  isValidObjectId
};