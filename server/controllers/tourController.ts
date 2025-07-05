import { Request, Response } from 'express';
import { Tour } from '../models/Tour';
import { body, validationResult } from 'express-validator';

// Get all tours with optional category filter
export const getAllTours = async (req: Request, res: Response) => {
  try {
    const { category, status = 'active' } = req.query;
    
    const filter: any = { status };
    if (category) {
      filter.category = category;
    }

    const tours = await Tour.find(filter).sort({ createdAt: -1 });

    // Group tours by category for frontend
    const groupedTours = {
      'Golden Triangle': tours.filter(tour => tour.category === 'Golden Triangle'),
      'Rajasthan Tours': tours.filter(tour => tour.category === 'Rajasthan Tours'),
      'Extended Tours': tours.filter(tour => tour.category === 'Extended Tours')
    };

    res.json({
      success: true,
      data: {
        tours,
        groupedTours,
        total: tours.length
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tours',
      error: error.message
    });
  }
};

// Get single tour by ID or slug
export const getTourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to find by slug first, then by ID
    let tour = await Tour.findOne({ slug: id });
    if (!tour) {
      tour = await Tour.findById(id);
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error: error.message
    });
  }
};

// Get tour by slug
export const getTourBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const tour = await Tour.findOne({ slug: slug, status: 'active' });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error: error.message
    });
  }
};

// Create new tour (admin only)
export const createTour = [
  // Validation middleware
  body('name').notEmpty().trim().withMessage('Tour name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('overview').notEmpty().withMessage('Overview is required'),
  body('category').isIn(['Golden Triangle', 'Rajasthan Tours', 'Extended Tours']).withMessage('Invalid category'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),

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

      // Generate slug from name
      const slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingTour = await Tour.findOne({ slug });
      if (existingTour) {
        return res.status(400).json({
          success: false,
          message: 'A tour with this name already exists'
        });
      }

      const tour = new Tour({
        ...req.body,
        slug
      });

      await tour.save();

      res.status(201).json({
        success: true,
        message: 'Tour created successfully',
        data: tour
      });
    } catch (error) {
      console.error('Create tour error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating tour',
        error: error.message
      });
    }
  }
];

// Update tour (admin only)
export const updateTour = [
  body('name').optional().notEmpty().trim().withMessage('Tour name cannot be empty'),
  body('overview').optional().notEmpty().withMessage('Overview cannot be empty'),
  body('category').optional().isIn(['Golden Triangle', 'Rajasthan Tours', 'Extended Tours']).withMessage('Invalid category'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('maxGuests').optional().isInt({ min: 1 }).withMessage('Max guests must be at least 1'),

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

      const { id } = req.params;
      const updates = req.body;

      // If name is being updated, regenerate slug
      if (updates.name) {
        const newSlug = updates.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        const existingTour = await Tour.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existingTour) {
          return res.status(400).json({
            success: false,
            message: 'A tour with this name already exists'
          });
        }
        
        updates.slug = newSlug;
      }

      const tour = await Tour.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      res.json({
        success: true,
        message: 'Tour updated successfully',
        data: tour
      });
    } catch (error) {
      console.error('Update tour error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating tour',
        error: error.message
      });
    }
  }
];

// Delete tour (admin only)
export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tour',
      error: error.message
    });
  }
};
