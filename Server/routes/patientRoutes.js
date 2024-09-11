import express from 'express';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

router.get('/:id', patientController.getPatientById);
router.get('/', patientController.getAllPatients);
router.get('/therapist/:therapistID', patientController.getPatientsByTherapist);
router.post('/addPatient', patientController.createPatient);
router.get('/check/:id', patientController.checkPatientExists);
router.get('/getId/:id', patientController.getPatientIdByIdNumber);
router.put('/:id', patientController.updatePatient);

export default router;
