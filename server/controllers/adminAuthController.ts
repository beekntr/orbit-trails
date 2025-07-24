import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { generateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { body, validationResult } from 'express-validator';
import { Contact } from '../models/Contact';
import { CustomizeTour } from '../models/CustomizeTour';
import { Tour } from '../models/Tour';

// Admin login
export const adminLogin = [
  body('username').notEmpty().trim().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { username, password } = req.body;

      // Find admin by username
      const admin = await Admin.findOne({ username, isActive: true });
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate token
      const token = generateToken(admin._id.toString());

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message
      });
    }
  }
];

// Get admin dashboard data
export const getAdminDashboardData = async (req: Request, res: Response) => {
  try {
    // Get all data for admin dashboard
    const [
      tours,
      contacts,
      customTours
    ] = await Promise.all([
      Tour.find().sort({ createdAt: -1 }),
      Contact.find().sort({ createdAt: -1 }),
      CustomizeTour.find().sort({ createdAt: -1 })
    ]);

    // Get stats
    const stats = {
      tours: {
        total: tours.length,
        active: tours.filter(t => t.status === 'active').length,
        draft: tours.filter(t => t.status === 'draft').length
      },
      contacts: {
        total: contacts.length,
        new: contacts.filter(c => !c.status || c.status === 'new').length,
        processed: contacts.filter(c => c.status && c.status !== 'new').length
      },
      customRequests: {
        total: customTours.length,
        new: customTours.filter(c => !c.status || c.status === 'new').length,
        processed: customTours.filter(c => c.status && c.status !== 'new').length
      }
    };

    // Get tours by category
    const toursByCategory = tours.reduce((acc: any, tour) => {
      acc[tour.category] = (acc[tour.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        tours,
        contacts,
        customTours,
        stats,
        toursByCategory
      }
    });
  } catch (error) {
    console.error('Get admin dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Create admin (super-admin only)
export const createAdmin = [
  body('username').notEmpty().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'super-admin']).withMessage('Invalid role'),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { username, email, password, role = 'admin' } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({
        $or: [{ username }, { email }]
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this username or email already exists'
        });
      }

      const admin = new Admin({
        username,
        email,
        password,
        role
      });

      await admin.save();

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating admin',
        error: error.message
      });
    }
  }
];

// Get current admin profile
export const getCurrentAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const admin = req.admin;
    
    res.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
};
