import { Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../utils/emailService';

// Create contact message
export const createContactMessage = [
  // Validation middleware
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('message').notEmpty().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),

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

      const contactData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
      };

      const contact = new Contact(contactData);
      await contact.save();

      // Send email notification to admin
      try {
        const emailSubject = 'New Contact Message - Orbit Trails';
        const emailBody = `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p>Reply to: ${contact.email}</p>
        `;

        await sendEmail(
          contact.email,
          emailSubject,
          emailBody
        );
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          status: contact.status
        }
      });
    } catch (error) {
      console.error('Create contact message error:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending message',
        error: error.message
      });
    }
  }
];

// Get all contact messages (admin only)
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    });
  }
};

// Get single contact message (admin only)
export const getContactMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact message',
      error: error.message
    });
  }
};

// Update contact message status (admin only)
export const updateContactMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Update contact message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};
