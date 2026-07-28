/// <reference path="../global.d.ts" />
import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import {
  financialDataCreateSchema,
  financialDataUpdateSchema,
  financialDataQuerySchema,
} from '../validation/financial.validation';
import { validate } from '../middleware/error.middleware';
import { AppError } from '../middleware/error.middleware';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/financial:
 *   post:
 *     summary: Submit financial data
 *     tags: [Financial Data]
 *     description: Creates a new financial data record for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinancialDataInput'
 *     responses:
 *       201:
 *         description: Financial data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Financial data submitted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FinancialData'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  validate(financialDataCreateSchema, 'body'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const {
        accountNumber,
        accountType,
        institutionName,
        balance,
        currency,
        dataSource,
        isEncrypted,
        encryptionKeyId,
        metadata,
      } = req.body;

      const financialData = await prisma.financialData.create({
        data: {
          userId,
          accountNumber: accountNumber || null,
          accountType,
          institutionName,
          balance,
          currency,
          dataSource,
          isEncrypted,
          encryptionKeyId: encryptionKeyId || null,
          metadata,
          lastSyncedAt: new Date(),
        },
      });

      res.status(201).json({
        status: 'success',
        message: 'Financial data submitted successfully',
        data: financialData,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/financial:
 *   get:
 *     summary: List user's financial data
 *     tags: [Financial Data]
 *     description: Retrieves all financial data records for the authenticated user with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: institutionName
 *         schema:
 *           type: string
 *         description: Filter by institution name
 *       - in: query
 *         name: accountType
 *         schema:
 *           type: string
 *         description: Filter by account type
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Filter by currency code
 *       - in: query
 *         name: minBalance
 *         schema:
 *           type: number
 *         description: Minimum balance filter
 *       - in: query
 *         name: maxBalance
 *         schema:
 *           type: number
 *         description: Maximum balance filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Financial data list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FinancialData'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  validate(financialDataQuerySchema, 'query'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const {
        institutionName,
        accountType,
        currency,
        minBalance,
        maxBalance,
        page,
        limit,
      } = req.query as Record<string, string>;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = { userId };

      if (institutionName) {
        where.institutionName = { contains: institutionName, mode: 'insensitive' };
      }
      if (accountType) {
        where.accountType = { contains: accountType, mode: 'insensitive' };
      }
      if (currency) {
        where.currency = currency;
      }
      if (minBalance || maxBalance) {
        where.balance = {};
        if (minBalance) {
          (where.balance as Record<string, unknown>).gte = parseFloat(minBalance);
        }
        if (maxBalance) {
          (where.balance as Record<string, unknown>).lte = parseFloat(maxBalance);
        }
      }

      const [items, total] = await Promise.all([
        prisma.financialData.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.financialData.count({ where }),
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          items,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/financial/{id}:
 *   get:
 *     summary: Get single financial data record
 *     tags: [Financial Data]
 *     description: Retrieves a specific financial data record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Financial data record ID
 *     responses:
 *       200:
 *         description: Financial data record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/FinancialData'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - does not own the record
 *       404:
 *         description: Record not found
 */
router.get(
  '/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const record = await prisma.financialData.findUnique({
        where: { id },
      });

      if (!record) {
        throw new AppError('Financial data record not found', 404);
      }

      if (record.userId !== userId) {
        throw new AppError('Access denied: you do not own this record', 403);
      }

      res.status(200).json({
        status: 'success',
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/financial/{id}:
 *   put:
 *     summary: Update financial data record
 *     tags: [Financial Data]
 *     description: Updates an existing financial data record (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Financial data record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinancialDataUpdateInput'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Financial data updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FinancialData'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.put(
  '/:id',
  validate(financialDataUpdateSchema, 'body'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const existing = await prisma.financialData.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError('Financial data record not found', 404);
      }

      if (existing.userId !== userId) {
        throw new AppError('Access denied: you do not own this record', 403);
      }

      const {
        accountNumber,
        accountType,
        institutionName,
        balance,
        currency,
        dataSource,
        isEncrypted,
        encryptionKeyId,
        metadata,
      } = req.body;

      const updated = await prisma.financialData.update({
        where: { id },
        data: {
          accountNumber: accountNumber !== undefined ? accountNumber || null : undefined,
          accountType,
          institutionName,
          balance,
          currency,
          dataSource,
          isEncrypted,
          encryptionKeyId:
            encryptionKeyId !== undefined ? encryptionKeyId || null : undefined,
          metadata,
          lastSyncedAt: new Date(),
        },
      });

      res.status(200).json({
        status: 'success',
        message: 'Financial data updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/financial/{id}:
 *   delete:
 *     summary: Delete financial data record
 *     tags: [Financial Data]
 *     description: Deletes a specific financial data record (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Financial data record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Financial data deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
router.delete(
  '/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const existing = await prisma.financialData.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError('Financial data record not found', 404);
      }

      if (existing.userId !== userId) {
        throw new AppError('Access denied: you do not own this record', 403);
      }

      await prisma.financialData.delete({
        where: { id },
      });

      res.status(200).json({
        status: 'success',
        message: 'Financial data deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
