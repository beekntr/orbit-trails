import { Router } from 'express';
import {
  createCustomTourRequest,
  getAllCustomTourRequests,
  getCustomTourRequestById,
  updateCustomTourRequestStatus
} from '../controllers/customizeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { createRateLimiter } from '../guards.mjs';

const router = Router();

// Public routes (same per-IP limit as the production server)
const customTourLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'You have sent several requests in a short time. Please try again in a few minutes.'
});
router.post('/', customTourLimiter, createCustomTourRequest);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllCustomTourRequests);
router.get('/:id', authMiddleware, getCustomTourRequestById);
router.patch('/:id/status', authMiddleware, updateCustomTourRequestStatus);

export default router;
