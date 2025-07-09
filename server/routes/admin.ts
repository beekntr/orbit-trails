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

// Secure API documentation endpoint - admin only
router.get('/api-docs', authMiddleware, (req: any, res) => {
  res.json({
    message: 'Orbit Trails API Documentation',
    endpoints: [
      'GET /health - Health check',
      'GET /api/health - API health check',
      'GET /api/tours - Get all tours',
      'GET /api/tours/slug/:slug - Get tour by slug',
      'POST /api/tours - Create tour (admin)',
      'PUT /api/tours/:id - Update tour (admin)',
      'DELETE /api/tours/:id - Delete tour (admin)',
      'POST /api/contact - Submit contact form',
      'GET /api/contact - Get all contacts (admin)',
      'GET /api/contact/:id - Get contact by ID (admin)',
      'PATCH /api/contact/:id/status - Update contact status (admin)',
      'POST /api/customize-tour - Submit custom tour request',
      'GET /api/customize-tour - Get all custom tours (admin)',
      'GET /api/customize-tour/:id - Get custom tour by ID (admin)',
      'PATCH /api/customize-tour/:id/status - Update custom tour status (admin)',
      'POST /api/admin/login - Admin login',
      'GET /api/admin/profile - Get admin profile (admin)',
      'GET /api/admin/dashboard - Get dashboard data (admin)',
      'GET /api/admin/api-docs - Get API documentation (admin)'
    ],
    timestamp: new Date().toISOString(),
    adminUser: req.user?.email
  });
});

export default router;
