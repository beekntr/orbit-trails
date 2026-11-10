import { Router } from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus
} from '../controllers/contactController';
import { authMiddleware } from '../middleware/authMiddleware';
import { createRateLimiter } from '../guards.mjs';

const router = Router();

// Public routes (same per-IP limit as the production server)
const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'You have sent several messages in a short time. Please try again in a few minutes.'
});
router.post('/', contactLimiter, createContactMessage);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllContactMessages);
router.get('/:id', authMiddleware, getContactMessageById);
router.patch('/:id/status', authMiddleware, updateContactMessageStatus);

export default router;
