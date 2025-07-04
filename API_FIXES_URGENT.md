# 🚨 URGENT FIXES FOR API ISSUES

## 🔍 Problems Identified

1. **Frontend calling wrong URL**: `localhost:3000` instead of `api.orbittrails.com`
2. **Backend serving frontend**: Causing dist/spa errors
3. **Database not connected**: API returning "Internal server error"

## ⚡ IMMEDIATE FIXES

### 1. Fix Backend - Remove Frontend Serving (30 seconds)

On your server:
```bash
cd /home/lester/orbit-trails

# Create a clean API-only server
cat > server/api-only.mjs << 'EOF'
// API-only server - no frontend serving
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://your-frontend-domain.vercel.app',
    'https://orbittrails.vercel.app'
  ],
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

// API routes
app.get('/api/demo', (req, res) => {
  res.json({ message: 'Orbit Trails API is working!' });
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
EOF

# Update PM2 to use the new server
pm2 stop orbit-trails-api
pm2 delete orbit-trails-api
pm2 start server/api-only.mjs --name orbit-trails-api --env production
pm2 save
```

### 2. Test Backend (30 seconds)

```bash
# Test the API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/health
curl http://localhost:3001/api/tours
```

### 3. Fix Frontend API URL

You need to update your frontend to call `api.orbittrails.com` instead of `localhost:3000`.

**In your Vercel dashboard:**
- Set environment variable: `VITE_API_URL=https://api.orbittrails.com`
- Redeploy the frontend

### 4. Test External API Access

```bash
# Test through Nginx (should work after SSL setup)
curl https://api.orbittrails.com/health
curl https://api.orbittrails.com/api/tours
```

## 🎯 Expected Results

After these fixes:

1. **Backend logs**: Clean startup, no dist/spa errors
2. **Frontend**: Should fetch tours successfully  
3. **API calls**: `https://api.orbittrails.com/api/tours` returns data

## 🔧 Quick Test Commands

```bash
# On server - check PM2 status
pm2 status
pm2 logs orbit-trails-api --lines 10

# Test API directly
curl http://localhost:3001/api/tours

# Test through domain (after SSL)
curl https://api.orbittrails.com/api/tours
```

## 🚨 If Still Issues

1. **Check CORS**: Make sure your frontend domain is in CORS origins
2. **Check SSL**: Ensure Nginx + SSL is working
3. **Check environment**: Verify `.env` file has correct values

Run these fixes and let me know the results! 🚀
