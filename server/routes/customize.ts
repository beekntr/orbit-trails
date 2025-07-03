import { Router } from 'express';
import {
  createCustomTourRequest,
  getAllCustomTourRequests,
  getCustomTourRequestById,
  updateCustomTourRequestStatus
} from '../controllers/customizeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/', createCustomTourRequest);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllCustomTourRequests);
router.get('/:id', authMiddleware, getCustomTourRequestById);
router.patch('/:id/status', authMiddleware, updateCustomTourRequestStatus);

export default router;
