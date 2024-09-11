import express from 'express';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// GET requests
router.get('/', messageController.getAllMessages);
router.get('/:id', messageController.getMessageById);

// POST requests
router.post('/', messageController.createMessage);

// PUT requests
router.put('/:id', messageController.updateMessage);

// DELETE requests
router.delete('/:id', messageController.deleteMessage);

export default router;
