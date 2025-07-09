/**
 * Security Configuration for Orbit Trails API
 * 
 * This file contains security guidelines and configurations to prevent
 * common security vulnerabilities in the API server.
 */

const securityConfig = {
  // Production Security Headers
  headers: {
    'X-Powered-By': false, // Hide Express.js signature
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'"
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://www.orbittrails.com', 'https://orbittrails.com']
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Admin Authentication Requirements
  admin: {
    jwtExpiresIn: '24h',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 30 * 60 * 1000 // 30 minutes
  },

  // Public API Limits
  publicEndpoints: [
    'GET /health',
    'GET /api/health',
    'GET /api/tours',
    'GET /api/tours/slug/:slug',
    'POST /api/contact',
    'POST /api/customize-tour'
  ],

  // Admin-Only Endpoints (require authentication)
  adminEndpoints: [
    'POST /api/tours',
    'PUT /api/tours/:id',
    'DELETE /api/tours/:id',
    'GET /api/contact',
    'GET /api/contact/:id',
    'PATCH /api/contact/:id/status',
    'GET /api/customize-tour',
    'GET /api/customize-tour/:id',
    'PATCH /api/customize-tour/:id/status',
    'GET /api/admin/profile',
    'GET /api/admin/dashboard',
    'GET /api/admin/api-docs'
  ],

  // Security Best Practices Checklist
  checklist: [
    '✅ Remove API endpoint exposure from public routes',
    '✅ Implement proper authentication for admin routes',
    '✅ Use environment variables for sensitive data',
    '✅ Enable CORS only for trusted domains',
    '✅ Implement rate limiting',
    '✅ Use HTTPS in production',
    '✅ Validate all input data',
    '✅ Log security events',
    '✅ Regular security audits',
    '✅ Keep dependencies updated'
  ]
};

module.exports = securityConfig;
