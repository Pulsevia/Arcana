import { z } from 'zod';

export const createTransactionSchema = z.object({
  userId: z.string(),
  type: z.enum(['deposit', 'withdraw', 'transfer', 'swap']),
  amount: z.number().positive(),
  currency: z.string().min(1),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  hash: z.string().optional(),
  metadata: z.any().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
