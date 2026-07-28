/// <reference path="../global.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = statusCode < 500;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.') || 'root';
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(issue.message);
    }
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const validate =
  (schema: z.ZodSchema, location: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[location];
      const parsed = schema.parse(data);
      req[location] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};
