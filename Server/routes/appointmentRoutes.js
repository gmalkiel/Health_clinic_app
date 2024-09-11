import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// GET requests
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.get('/therapist/:id', appointmentController.getAppointmentsByTherapist);//work

// POST requests
router.post('/', appointmentController.createAppointment);

// PUT requests
router.put('/:id', appointmentController.updateAppointment);

// DELETE requests
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
