import { Request, Response } from 'express';
import { CustomizeTour } from '../models/CustomizeTour';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../utils/emailService';

// Create custom tour request
export const createCustomTourRequest = [
  // Validation middleware
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('numberOfTravelers').isInt({ min: 1 }).withMessage('Number of travelers must be at least 1'),
  body('accommodationType').isIn(['Luxury', 'Comfort']).withMessage('Invalid accommodation type'),
  body('destinations').isArray({ min: 1 }).withMessage('At least one destination is required'),
  body('budgetRange').notEmpty().withMessage('Budget range is required'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().trim().withMessage('Phone number is required'),

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

      const customTourData = {
        startDate: new Date(req.body.startDate),
        duration: req.body.duration,
        numberOfTravelers: req.body.numberOfTravelers,
        accommodationType: req.body.accommodationType,
        destinations: req.body.destinations,
        budgetRange: req.body.budgetRange,
        comments: req.body.comments || '',
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        countryCode: req.body.countryCode || '+1'
      };

      const customTour = new CustomizeTour(customTourData);
      await customTour.save();

      // Send email notifications
      try {
        // Send notification to admin
        const adminEmailSubject = 'New Custom Tour Request - Orbit Trails';
        const adminEmailBody = `
          <h2>New Custom Tour Request</h2>
          <p><strong>Name:</strong> ${customTour.name}</p>
          <p><strong>Email:</strong> ${customTour.email}</p>
          <p><strong>Phone:</strong> ${customTour.countryCode} ${customTour.phone}</p>
          <p><strong>Start Date:</strong> ${customTour.startDate.toDateString()}</p>
          <p><strong>Duration:</strong> ${customTour.duration} days</p>
          <p><strong>Travelers:</strong> ${customTour.numberOfTravelers}</p>
          <p><strong>Accommodation:</strong> ${customTour.accommodationType}</p>
          <p><strong>Destinations:</strong> ${customTour.destinations.join(', ')}</p>
          <p><strong>Budget Range:</strong> ${customTour.budgetRange}</p>
          <p><strong>Comments:</strong> ${customTour.comments}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `;

        await sendEmail(
         customTour.email,
          adminEmailSubject,
          adminEmailBody
        );

        // Send confirmation to user
        const userEmailSubject = 'Thank You for Your Custom Tour Request - Orbit Trails';
        const userEmailBody = `
          <h2>Thank You for Your Custom Tour Request!</h2>
          <p>Dear ${customTour.name},</p>
          <p>We have received your custom tour request and our team will review it shortly. Here are the details we received:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Tour Request Details:</h3>
            <p><strong>Start Date:</strong> ${customTour.startDate.toDateString()}</p>
            <p><strong>Duration:</strong> ${customTour.duration} days</p>
            <p><strong>Number of Travelers:</strong> ${customTour.numberOfTravelers}</p>
            <p><strong>Accommodation Type:</strong> ${customTour.accommodationType}</p>
            <p><strong>Destinations:</strong> ${customTour.destinations.join(', ')}</p>
            <p><strong>Budget Range:</strong> ${customTour.budgetRange}</p>
            ${customTour.comments ? `<p><strong>Your Comments:</strong> ${customTour.comments}</p>` : ''}
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our travel experts will review your requirements</li>
            <li>We'll create a personalized itinerary just for you</li>
            <li>You'll receive a detailed proposal within 24 hours</li>
            <li>We'll contact you at ${customTour.email} or ${customTour.countryCode} ${customTour.phone}</li>
          </ul>
          
          <p>If you have any immediate questions, feel free to contact us:</p>
          <p>📧 Email: info@orbittrails.com</p>
          <p>📞 Phone: +91 98765 43210</p>
          
          <p>Thank you for choosing Orbit Trails for your India adventure!</p>
          
          <p>Best regards,<br>
          The Orbit Trails Team</p>
        `;

        await sendEmail(
          customTour.email,
          userEmailSubject,
          userEmailBody
        );
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Custom tour request submitted successfully. We will contact you within 24 hours.',
        data: {
          id: customTour._id,
          name: customTour.name,
          email: customTour.email,
          status: customTour.status
        }
      });
    } catch (error) {
      console.error('Create custom tour request error:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting custom tour request',
        error: error.message
      });
    }
  }
];

// Get all custom tour requests (admin only)
export const getAllCustomTourRequests = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const requests = await CustomizeTour.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CustomizeTour.countDocuments(filter);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get custom tour requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom tour requests',
      error: error.message
    });
  }
};

// Get single custom tour request (admin only)
export const getCustomTourRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = await CustomizeTour.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom tour request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get custom tour request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom tour request',
      error: error.message
    });
  }
};

// Update custom tour request status (admin only)
export const updateCustomTourRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'in-progress', 'quoted', 'booked', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await CustomizeTour.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom tour request not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update custom tour request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};
