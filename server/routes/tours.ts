import { Router } from 'express';
import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} from '../controllers/tourController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Protected routes (admin only)
router.post('/', authMiddleware, createTour);
router.put('/:id', authMiddleware, updateTour);
router.delete('/:id', authMiddleware, deleteTour);

export default router;
