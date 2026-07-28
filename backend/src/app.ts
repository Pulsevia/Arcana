/// <reference path="./global.d.ts" />
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import financialRoutes from './routes/financial.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { setupSwagger } from './swagger/swagger';
import prisma from './lib/prisma';

export const createApp = (): Express => {
  const app = express();

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Arcana Backend API',
      version: '1.0.0',
      docs: '/api/docs',
    });
  });

  app.get('/health', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', database: 'connected', uptime: process.uptime() });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
        error: String(error),
      });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/financial', financialRoutes);

  setupSwagger(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
