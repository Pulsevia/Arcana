import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByUserId,
} from '../controllers/transaction.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createTransactionSchema } from '../validations/transaction.validations';

const router = express.Router();

router.post('/', validateRequest(createTransactionSchema), createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.get('/user/:userId', getTransactionsByUserId);

export default router;
