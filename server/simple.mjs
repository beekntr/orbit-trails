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
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/api/tours', (req, res) => {
  res.json({
    tours: [
      {
        id: 1,
        name: 'Golden Triangle Tour',
        description: 'Explore Delhi, Agra, and Jaipur',
        price: 999
      },
      {
        id: 2,
        name: 'Rajasthan Heritage Tour',
        description: 'Discover the royal heritage of Rajasthan',
        price: 1299
      }
    ]
  });
});

// In production, serve static files if they exist
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist/spa');
  
  try {
    app.use(express.static(distPath));
    
    // Handle React Router - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } catch (err) {
    console.log('SPA files not found, running API only mode');
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
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
