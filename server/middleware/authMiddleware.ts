import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/backendTypes';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'procurement_manager' | 'procurement_specialist' | 'finance_director' | 'admin';
  department: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication-ready middleware that injects enterprise procurement user context
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Support custom auth headers (e.g. X-User-Role, Authorization Bearer)
  const authHeader = req.headers.authorization;
  const roleHeader = (req.headers['x-user-role'] as any) || 'procurement_manager';

  req.user = {
    id: 'usr-101',
    name: 'Aditya Sen',
    email: 'aditya.sen@vendrax.internal',
    role: roleHeader,
    department: 'IT & Digital Engineering',
  };

  next();
}

/**
 * Standardized API Response Helper
 */
export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, error: string, statusCode: number = 400) {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
}

/**
 * Global Error Handler Middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return sendError(res, message, status);
}
