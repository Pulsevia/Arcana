import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import prisma from './lib/prisma';
import userRoutes from './routes/user.routes';
import transactionRoutes from './routes/transaction.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Arcana Backend - API v1');
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', uptime: process.uptime() });
  } catch (error) {
    res.json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
