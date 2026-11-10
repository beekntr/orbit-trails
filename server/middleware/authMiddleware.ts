import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
// Shared with the production server (api-server.mjs): never falls back to a hardcoded secret.
import { getJwtSecret } from '../guards.mjs';

export interface AuthenticatedRequest extends Request {
  admin?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as any;
    
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid or admin is inactive' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

export const generateToken = (adminId: string): string => {
  const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign({ id: adminId }, getJwtSecret(), { expiresIn: JWT_EXPIRE } as jwt.SignOptions);
};
