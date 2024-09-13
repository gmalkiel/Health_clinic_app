import { sessionSchema, patientSchema, therapistSchema } from './validationSchemas.js';

export function validateSession(req, res, next) {
  const { error } = sessionSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
}


// validating Patient data
export function validatePatient(req, res, next) {
  const { error } = patientSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
}

// validating Therapist data
export function validateTherapist(req, res, next) {
  const { error } = therapistSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
}


/*import { body, validationResult } from 'express-validator';

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
*/