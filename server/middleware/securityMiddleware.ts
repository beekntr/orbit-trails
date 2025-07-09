import { Request, Response, NextFunction } from 'express';

/**
 * Security middleware to prevent information disclosure
 */
export const secureInfoMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

/**
 * Middleware to prevent API documentation exposure
 */
export const preventDocsExposure = (req: Request, res: Response, next: NextFunction) => {
  // Block requests trying to access API documentation from public routes
  const suspiciousPatterns = [
    '/api/docs',
    '/api/documentation',
    '/docs',
    '/swagger',
    '/api-docs'
  ];

  const path = req.path.toLowerCase();
  const isSuspicious = suspiciousPatterns.some(pattern => path.includes(pattern));

  if (isSuspicious && !req.headers.authorization) {
    return res.status(404).json({
      success: false,
      error: 'Not found'
    });
  }

  next();
};

/**
 * Rate limiting for public endpoints
 */
export const createRateLimit = () => {
  const requests = new Map();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 100;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter((timestamp: number) => now - timestamp < WINDOW_MS);
    
    if (validRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(WINDOW_MS / 1000)
      });
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    next();
  };
};
