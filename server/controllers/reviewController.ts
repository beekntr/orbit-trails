import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { body, validationResult } from 'express-validator';

// Submit new review (public)
export const submitReview = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('description').notEmpty().trim().isLength({ max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { name, email, rating, description } = req.body;

      const review = new Review({
        name,
        email,
        rating,
        description,
        status: 'pending',
        isApproved: false
      });

      await review.save();

      res.status(201).json({
        success: true,
        message: 'Thank you for your review! It will be published after approval.',
        data: {
          id: review._id,
          name: review.name,
          rating: review.rating,
          description: review.description,
          status: review.status
        }
      });
    } catch (error) {
      console.error('Submit review error:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting review',
        error: error.message
      });
    }
  }
];

// Get all approved reviews (public)
export const getApprovedReviews = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .select('name rating description createdAt');

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get approved reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get random approved reviews for homepage (public)
export const getRandomApprovedReviews = async (req: Request, res: Response) => {
  try {
    const { count = 3 } = req.query;
    
    const reviews = await Review.aggregate([
      { $match: { isApproved: true } },
      { $sample: { size: parseInt(count as string) } },
      { $project: { name: 1, rating: 1, description: 1, createdAt: 1 } }
    ]);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get random reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching random reviews',
      error: error.message
    });
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Update review status (admin only)
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { 
        status,
        isApproved: status === 'approved'
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: `Review ${status} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

// Delete review (admin only)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};
