import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { CreateTransactionInput } from '../validations/transaction.validations';

export const createTransaction = async (
  req: Request<{}, {}, CreateTransactionInput>,
  res: Response
) => {
  const transaction = await prisma.transaction.create({
    data: req.body,
    include: {
      user: true,
    },
  });

  res.status(201).json({ transaction });
};

export const getTransactions = async (_req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: true,
    },
  });

  res.json({ transactions });
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({ transaction });
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      user: true,
    },
  });

  res.json({ transactions });
};
