import Joi from 'joi';

// Define the schema for validating session data
export const sessionSchema = Joi.object({
  SessionContent: Joi.string().min(5).required(),
  SessionSummary: Joi.string().allow(null, ''), 
  ArtworkImagePath: Joi.string().uri().allow(null, '') // Allow null or empty string if not required
});

// Schema for validating Patient data
export const patientSchema = Joi.object({
    TherapistID: Joi.number().integer().required(),
    Name: Joi.string().min(3).required(),
    Age: Joi.number().integer().min(0).required(),
    IDNumber: Joi.string().alphanum().min(5).max(20).required(),
    MaritalStatus: Joi.string().optional().allow(null, ''),
    SiblingPosition: Joi.number().integer().optional().allow(null),
    SiblingsNumber: Joi.number().integer().optional().allow(null),
    EducationalInstitution: Joi.string().optional().allow(null, ''),
    Medication: Joi.string().optional().allow(null, ''),
    ReferralSource: Joi.string().optional().allow(null, ''),
    RemainingPayment: Joi.number().integer().optional().allow(null)
  });
  
  // Schema for validating Therapist data
  export const therapistSchema = Joi.object({
    Name: Joi.string().min(3).required(),
    IDNumber: Joi.string().alphanum().min(5).max(20).required(),
    DateOfBirth: Joi.date().iso().required(),
    Email: Joi.string().email().required(),
    UserName: Joi.string().min(3).required(),
    T_Password: Joi.string().min(6).required(), 
    Gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    Adress: Joi.string().optional().allow(null, ''),
    Phone: Joi.string().optional().allow(null, ''),
    SessionPrice: Joi.number().precision(2).required()
  });