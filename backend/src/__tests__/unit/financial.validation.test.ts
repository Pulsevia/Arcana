/// <reference path="../../global.d.ts" />
import {
  financialDataCreateSchema,
  financialDataUpdateSchema,
  financialDataQuerySchema,
} from '../validation/financial.validation';

describe('Financial Data Validation Schemas', () => {
  describe('financialDataCreateSchema', () => {
    const validData = {
      accountType: 'checking',
      institutionName: 'Bank of Testing',
      balance: 12345.67,
      dataSource: 'manual',
    };

    it('should accept valid data with required fields only', () => {
      const result = financialDataCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
        expect(result.data.isEncrypted).toBe(false);
      }
    });

    it('should accept all optional fields provided', () => {
      const result = financialDataCreateSchema.safeParse({
        ...validData,
        accountNumber: '****-****-****-1234',
        currency: 'EUR',
        isEncrypted: true,
        encryptionKeyId: 'kms-key-001',
        metadata: { importedAt: '2024-01-01' },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('EUR');
        expect(result.data.isEncrypted).toBe(true);
      }
    });

    it('should reject missing required fields', () => {
      const result = financialDataCreateSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i: { path: (string | number)[] }) => i.path[0]);
        expect(paths).toContain('accountType');
        expect(paths).toContain('institutionName');
        expect(paths).toContain('balance');
        expect(paths).toContain('dataSource');
      }
    });

    it('should reject non-numeric balance', () => {
      const result = financialDataCreateSchema.safeParse({
        ...validData,
        balance: 'not-a-number',
      });
      expect(result.success).toBe(false);
    });

    it('should reject infinite or NaN balance', () => {
      const result1 = financialDataCreateSchema.safeParse({
        ...validData,
        balance: Infinity,
      });
      const result2 = financialDataCreateSchema.safeParse({
        ...validData,
        balance: NaN,
      });
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });

    it('should reject invalid currency codes', () => {
      const result = financialDataCreateSchema.safeParse({
        ...validData,
        currency: 'usd',
      });
      expect(result.success).toBe(false);

      const result2 = financialDataCreateSchema.safeParse({
        ...validData,
        currency: 'US',
      });
      expect(result2.success).toBe(false);
    });

    it('should allow empty string accountNumber (become null via routes)', () => {
      const result = financialDataCreateSchema.safeParse({
        ...validData,
        accountNumber: '',
      });
      expect(result.success).toBe(true);
    });

    it('should trim string fields', () => {
      const result = financialDataCreateSchema.safeParse({
        ...validData,
        accountType: '  savings  ',
        institutionName: '  My Bank  ',
        dataSource: '  plaid  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accountType).toBe('savings');
        expect(result.data.institutionName).toBe('My Bank');
        expect(result.data.dataSource).toBe('plaid');
      }
    });
  });

  describe('financialDataUpdateSchema', () => {
    it('should accept partial updates (no required fields)', () => {
      const result = financialDataUpdateSchema.safeParse({ balance: 999.99 });
      expect(result.success).toBe(true);
    });

    it('should reject invalid balance type', () => {
      const result = financialDataUpdateSchema.safeParse({
        balance: 'abc',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid currency in partial update', () => {
      const result = financialDataUpdateSchema.safeParse({ currency: 'US' });
      expect(result.success).toBe(false);
    });
  });

  describe('financialDataQuerySchema', () => {
    it('should accept empty query with defaults applied', () => {
      const result = financialDataQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe('1');
        expect(result.data.limit).toBe('20');
      }
    });

    it('should accept all filters with valid values', () => {
      const result = financialDataQuerySchema.safeParse({
        institutionName: 'Chase',
        accountType: 'checking',
        currency: 'USD',
        minBalance: '100',
        maxBalance: '10000',
        page: '2',
        limit: '50',
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-numeric minBalance', () => {
      const result = financialDataQuerySchema.safeParse({
        minBalance: 'abc',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-positive page', () => {
      const result = financialDataQuerySchema.safeParse({ page: '0' });
      expect(result.success).toBe(false);

      const result2 = financialDataQuerySchema.safeParse({ page: '-1' });
      expect(result2.success).toBe(false);
    });

    it('should reject limit > 100 or <= 0', () => {
      const result1 = financialDataQuerySchema.safeParse({ limit: '0' });
      const result2 = financialDataQuerySchema.safeParse({ limit: '101' });
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });
});
