import express from 'express';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.get('/:id', sessionController.getSessionById);
router.post('/addsession/:PatientID', sessionController.createSession);
router.put('/:id', sessionController.updateSession);

export default router;
