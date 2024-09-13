import { body, validationResult } from 'express-validator';

// Validate patient data
export const validatePatient = [
  body('Name').notEmpty().withMessage('Name is required'),
  body('Age').isInt({ gt: 0 }).withMessage('Age must be a positive integer'),
  body('IDNumber').notEmpty().withMessage('IDNumber is required'),
  // Add other validation rules as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validate therapist data
export const validateTherapist = [
  body('Name').notEmpty().withMessage('Name is required'),
  body('IDNumber').notEmpty().withMessage('IDNumber is required'),
  body('Email').isEmail().withMessage('Invalid email format'),
  // Add other validation rules as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
