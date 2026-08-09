/// <reference path="../global.d.ts" />
import { z } from 'zod';

export const financialDataCreateSchema = z.object({
  accountNumber: z
    .string()
    .max(100, 'Account number must not exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  accountType: z
    .string({ required_error: 'Account type is required' })
    .min(2, 'Account type must be at least 2 characters')
    .max(50, 'Account type must not exceed 50 characters')
    .trim(),
  institutionName: z
    .string({ required_error: 'Institution name is required' })
    .min(2, 'Institution name must be at least 2 characters')
    .max(255, 'Institution name must not exceed 255 characters')
    .trim(),
  balance: z
    .number({
      required_error: 'Balance is required',
      invalid_type_error: 'Balance must be a valid number',
    })
    .finite('Balance must be a finite number'),
  currency: z
    .string()
    .length(3, 'Currency code must be exactly 3 characters (ISO 4217)')
    .regex(/^[A-Z]{3}$/, 'Currency must be a valid ISO 4217 code (e.g., USD, EUR)')
    .default('USD'),
  dataSource: z
    .string({ required_error: 'Data source is required' })
    .min(2, 'Data source must be at least 2 characters')
    .max(100, 'Data source must not exceed 100 characters')
    .trim(),
  isEncrypted: z.boolean().default(false),
  encryptionKeyId: z.string().max(100).trim().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const financialDataUpdateSchema = z.object({
  accountNumber: z
    .string()
    .max(100, 'Account number must not exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  accountType: z
    .string()
    .min(2, 'Account type must be at least 2 characters')
    .max(50, 'Account type must not exceed 50 characters')
    .trim()
    .optional(),
  institutionName: z
    .string()
    .min(2, 'Institution name must be at least 2 characters')
    .max(255, 'Institution name must not exceed 255 characters')
    .trim()
    .optional(),
  balance: z
    .number({ invalid_type_error: 'Balance must be a valid number' })
    .finite('Balance must be a finite number')
    .optional(),
  currency: z
    .string()
    .length(3, 'Currency code must be exactly 3 characters (ISO 4217)')
    .regex(/^[A-Z]{3}$/, 'Currency must be a valid ISO 4217 code (e.g., USD, EUR)')
    .optional(),
  dataSource: z
    .string()
    .min(2, 'Data source must be at least 2 characters')
    .max(100, 'Data source must not exceed 100 characters')
    .trim()
    .optional(),
  isEncrypted: z.boolean().optional(),
  encryptionKeyId: z.string().max(100).trim().optional().or(z.literal('')),
  metadata: z.record(z.unknown()).optional(),
});

export const financialDataQuerySchema = z.object({
  institutionName: z.string().trim().optional(),
  accountType: z.string().trim().optional(),
  currency: z.string().trim().optional(),
  minBalance: z
    .string()
    .refine(
      (val: string) => !isNaN(parseFloat(val)),
      'minBalance must be a valid number'
    )
    .optional(),
  maxBalance: z
    .string()
    .refine(
      (val: string) => !isNaN(parseFloat(val)),
      'maxBalance must be a valid number'
    )
    .optional(),
  page: z
    .string()
    .refine((val: string) => parseInt(val, 10) > 0, 'page must be a positive integer')
    .optional()
    .default('1'),
  limit: z
    .string()
    .refine(
      (val: string) => parseInt(val, 10) > 0 && parseInt(val, 10) <= 100,
      'limit must be between 1 and 100'
    )
    .optional()
    .default('20'),
});

export type FinancialDataCreateInput = z.infer<typeof financialDataCreateSchema>;
export type FinancialDataUpdateInput = z.infer<typeof financialDataUpdateSchema>;
export type FinancialDataQueryInput = z.infer<typeof financialDataQuerySchema>;
