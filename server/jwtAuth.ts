import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { RequestHandler } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-should-be-very-long-and-random-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const authenticateJWT: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = verifyToken(token);
    
    // For better performance, only fetch user from DB for auth/user endpoint
    // For other endpoints, we can rely on the token data
    if (req.path === '/api/auth/user') {
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
      }
      (req as any).user = user;
    } else {
      // For other endpoints, create minimal user object from token
      (req as any).user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    console.error('JWT Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

export const requireRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};