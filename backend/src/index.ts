import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import prisma from './lib/prisma';

const app = express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Arcana Backend - Database Integrated');
});

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', uptime: process.uptime() });
  } catch (error) {
    res.json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

app.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { profile: true } });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await prisma.user.create({ data: { username, email } });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/transactions', async (_req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const { userId, type, amount, currency, status } = req.body;
    const transaction = await prisma.transaction.create({
      data: { userId, type, amount, currency, status }
    });
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
