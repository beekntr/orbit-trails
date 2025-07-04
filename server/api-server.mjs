// Production API Server - Node.js with database connectivity
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Schemas
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const TourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  overview: { type: String, required: true },
  category: { type: String, required: true },
  price: Number,
  originalPrice: Number,
  duration: { type: String, required: true },
  maxGuests: { type: Number, default: 20 },
  minAge: { type: Number, default: 12 },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  highlights: [String],
  included: [String],
  notIncluded: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    highlights: [String]
  }],
  images: [String],
  destinations: [String],
  status: { type: String, default: 'active' }
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  status: { type: String, default: 'new' }
}, { timestamps: true });

const CustomTourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  countryCode: String,
  startDate: String,
  duration: Number,
  numberOfTravelers: Number,
  accommodationType: String,
  destinations: [String],
  budgetRange: String,
  comments: String,
  status: { type: String, default: 'new' }
}, { timestamps: true });

// Models
const Admin = mongoose.model('Admin', AdminSchema);
const Tour = mongoose.model('Tour', TourSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const CustomTour = mongoose.model('CustomTour', CustomTourSchema);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'https://www.orbittrails.com',
    'https://orbittrails.com',
    'https://orbit-trails.vercel.app',
    'https://www.orbit-trails.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Fix double slash URLs - handle //api/* patterns
app.use((req, res, next) => {
  if (req.url.includes('//api/')) {
    console.log(`Fixing double slash URL: ${req.url} -> ${req.url.replace('//api/', '/api/')}`);
    req.url = req.url.replace('//api/', '/api/');
  }
  next();
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'orbit-trails-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Orbit Trails API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Tours API
app.get('/api/tours', async (req, res) => {
  try {
    const tours = await Tour.find({ status: 'active' }).sort({ createdAt: -1 });
    const groupedTours = tours.reduce((acc, tour) => {
      acc[tour.category] = acc[tour.category] || [];
      acc[tour.category].push(tour);
      return acc;
    }, {});

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
});

app.get('/api/tours/slug/:slug', async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, status: 'active' });
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error: error.message
    });
  }
});

app.post('/api/tours', authMiddleware, async (req, res) => {
  try {
    // Generate slug from name if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const tour = new Tour(req.body);
    await tour.save();
    res.json({ success: true, data: tour });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tour',
      error: error.message
    });
  }
});

// PUT route for updating tours
app.put('/api/tours/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate slug from name if not provided but name is updated
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const tour = await Tour.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tour',
      error: error.message
    });
  }
});

// DELETE route for deleting tours
app.delete('/api/tours/:id', authMiddleware, async (req, res) => {
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
      message: 'Tour deleted successfully',
      data: tour 
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tour',
      error: error.message
    });
  }
});

// Contact API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

app.get('/api/contact', authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { messages } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    });
  }
});

app.get('/api/contact/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact message',
      error: error.message
    });
  }
});

// PATCH route for updating contact status
app.patch('/api/contact/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
});

// Custom Tour API
app.post('/api/customize-tour', async (req, res) => {
  try {
    const customTour = new CustomTour(req.body);
    await customTour.save();

    res.json({
      success: true,
      message: 'Tour customization request received',
      data: customTour
    });
  } catch (error) {
    console.error('Custom tour submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting custom tour request',
      error: error.message
    });
  }
});

app.get('/api/customize-tour', authMiddleware, async (req, res) => {
  try {
    const requests = await CustomTour.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { requests } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching custom tour requests',
      error: error.message
    });
  }
});

app.get('/api/customize-tour/:id', authMiddleware, async (req, res) => {
  try {
    const request = await CustomTour.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom tour request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching custom tour request',
      error: error.message
    });
  }
});

// PATCH route for updating custom tour status
app.patch('/api/customize-tour/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const customTour = await CustomTour.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!customTour) {
      return res.status(404).json({
        success: false,
        message: 'Custom tour request not found'
      });
    }

    res.json({ success: true, data: customTour });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating custom tour status',
      error: error.message
    });
  }
});

// Admin API
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'orbit-trails-secret-key';
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
});

app.get('/api/admin/dashboard', authMiddleware, async (req, res) => {
  try {
    const tours = await Tour.find();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const customTours = await CustomTour.find().sort({ createdAt: -1 });

    const stats = {
      totalTours: tours.length,
      activeTours: tours.filter(t => t.status === 'active').length,
      totalContacts: contacts.length,
      newContacts: contacts.filter(c => c.status === 'new').length,
      totalCustomTours: customTours.length,
      newCustomTours: customTours.filter(c => c.status === 'new').length
    };

    const toursByCategory = tours.reduce((acc, tour) => {
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
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// GET route for admin profile
app.get('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'API endpoint not found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// For non-API routes, return API info
app.get('*', (req, res) => {
  res.json({
    message: 'Orbit Trails API Server',
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
      'GET /api/admin/dashboard - Get dashboard data (admin)'
    ],
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`🚀 Orbit Trails API server running on port ${port}`);
      console.log(`🔧 API Health: http://localhost:${port}/health`);
      console.log(`📊 API Endpoints: http://localhost:${port}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
