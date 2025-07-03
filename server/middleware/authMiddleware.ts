import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';

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

    const JWT_SECRET = process.env.JWT_SECRET || 'orbit-trails-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
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
  const JWT_SECRET = process.env.JWT_SECRET || 'orbit-trails-secret-key';
  const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRE } as jwt.SignOptions);
};
