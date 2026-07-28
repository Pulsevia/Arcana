/// <reference path="../global.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from './error.middleware';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeaderRaw = req.headers.authorization;
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authentication required. Please provide a valid Bearer token.',
        401
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Invalid token format.', 401);
    }

    const decoded = authService.verifyToken(token);

    if (decoded.type === 'refresh') {
      throw new AppError(
        'Refresh token cannot be used for authentication. Use access token instead.',
        401
      );
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else if (err instanceof Error && err.name === 'TokenExpiredError') {
      next(new AppError('Token has expired. Please log in again.', 401));
    } else if (err instanceof Error && err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please log in again.', 401));
    } else {
      next(new AppError('Authentication failed.', 401));
    }
  }
};

export const requireRole = (_roles: string[]) => {
  return (
    _req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    next();
  };
};
