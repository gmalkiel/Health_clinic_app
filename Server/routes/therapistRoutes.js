import express from 'express';
import * as therapistController from '../controllers/therapistController.js';

const router = express.Router();

router.get('/', therapistController.getAllTherapists);
router.get('/:id', therapistController.getTherapistById);
router.post('/', therapistController.createTherapist);
router.put('/:id', therapistController.updateTherapist);
router.delete('/:id', therapistController.deleteTherapist);

export default router;
