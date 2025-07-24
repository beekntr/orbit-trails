import { Router } from 'express';
import {
  submitReview,
  getApprovedReviews,
  getRandomApprovedReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/', submitReview);
router.get('/approved', getApprovedReviews);
router.get('/random', getRandomApprovedReviews);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllReviews);
router.patch('/:id/status', authMiddleware, updateReviewStatus);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
