import { Router } from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus
} from '../controllers/contactController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/', createContactMessage);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllContactMessages);
router.get('/:id', authMiddleware, getContactMessageById);
router.patch('/:id/status', authMiddleware, updateContactMessageStatus);

export default router;
