import { Router } from 'express';
import {
  adminLogin,
  getAdminDashboardData,
  createAdmin,
  getCurrentAdmin
} from '../controllers/adminAuthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', authMiddleware, getCurrentAdmin);
router.get('/dashboard', authMiddleware, getAdminDashboardData);
router.post('/create', authMiddleware, createAdmin); // Only existing admins can create new ones

export default router;
