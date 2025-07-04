// Simple Node.js server entry point - no TypeScript, no tsx needed
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.orbittrails.com',
    'https://orbittrails.com',
    'https://orbit-trails.vercel.app',
    'https://www.orbit-trails.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Fix double slash URLs - redirect //api/* to /api/*
app.use('/api/*', (req, res, next) => {
  const newUrl = req.url.replace('//', '/');
  console.log(`Redirecting double slash: ${req.url} -> ${newUrl}`);
  req.url = newUrl;
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Orbit Trails API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API routes
app.get('/api/demo', (req, res) => {
  res.json({ message: 'Orbit Trails API is working!' });
});

// Direct handler for double slash API routes
app.get('/api/tours', (req, res) => {
  console.log('Handling double slash tours request');
  res.json({
    tours: [
      {
        _id: '1',
        name: 'Golden Triangle Tour',
        slug: 'golden-triangle-tour',
        description: 'Explore Delhi, Agra, and Jaipur',
        overview: 'A comprehensive tour of India\'s most famous triangle.',
        category: 'Golden Triangle',
        price: 999,
        originalPrice: 1299,
        duration: '7 days',
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        highlights: ['Taj Mahal', 'Red Fort', 'Hawa Mahal'],
        included: ['Hotels', 'Transport', 'Guide'],
        notIncluded: ['Flights', 'Meals'],
        itinerary: [
          { day: 1, title: 'Arrival in Delhi', description: 'Airport pickup and hotel check-in' }
        ]
      },
      {
        _id: '2',
        name: 'Rajasthan Heritage Tour',
        slug: 'rajasthan-heritage-tour',
        description: 'Discover the royal heritage of Rajasthan',
        overview: 'Experience the grandeur of Rajasthan\'s palaces and forts.',
        category: 'Rajasthan Tours',
        price: 1299,
        originalPrice: 1599,
        duration: '10 days',
        destinations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
        highlights: ['City Palace', 'Mehrangarh Fort', 'Lake Pichola'],
        included: ['Hotels', 'Transport', 'Guide'],
        notIncluded: ['Flights', 'Meals'],
        itinerary: [
          { day: 1, title: 'Arrival in Jaipur', description: 'Airport pickup and hotel check-in' }
        ]
      }
    ]
  });
});

app.get('/api/tours', (req, res) => {
  res.json({
    tours: [
      {
        _id: '1',
        name: 'Golden Triangle Tour',
        slug: 'golden-triangle-tour',
        description: 'Explore Delhi, Agra, and Jaipur',
        overview: 'A comprehensive tour of India\'s most famous triangle.',
        category: 'Golden Triangle',
        price: 999,
        originalPrice: 1299,
        duration: '7 days',
        destinations: ['Delhi', 'Agra', 'Jaipur'],
        highlights: ['Taj Mahal', 'Red Fort', 'Hawa Mahal'],
        included: ['Hotels', 'Transport', 'Guide'],
        notIncluded: ['Flights', 'Meals'],
        itinerary: [
          { day: 1, title: 'Arrival in Delhi', description: 'Airport pickup and hotel check-in' }
        ]
      },
      {
        _id: '2',
        name: 'Rajasthan Heritage Tour',
        slug: 'rajasthan-heritage-tour',
        description: 'Discover the royal heritage of Rajasthan',
        overview: 'Experience the grandeur of Rajasthan\'s palaces and forts.',
        category: 'Rajasthan Tours',
        price: 1299,
        originalPrice: 1599,
        duration: '10 days',
        destinations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
        highlights: ['City Palace', 'Mehrangarh Fort', 'Lake Pichola'],
        included: ['Hotels', 'Transport', 'Guide'],
        notIncluded: ['Flights', 'Meals'],
        itinerary: [
          { day: 1, title: 'Arrival in Jaipur', description: 'Airport pickup and hotel check-in' }
        ]
      }
    ]
  });
});

app.post('/api/customize-tour', (req, res) => {
  console.log('Customize tour request:', req.body);
  res.json({
    success: true,
    message: 'Tour customization request received',
    data: req.body
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// For non-API routes, return API info
app.get('*', (req, res) => {
  res.json({
    message: 'Orbit Trails API Server',
    endpoints: ['/health', '/api/health', '/api/demo', '/api/tours'],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Orbit Trails API server running on port ${port}`);
  console.log(`🔧 API Health: http://localhost:${port}/health`);
  console.log(`📊 API Endpoints: http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});
