/// <reference path="../../global.d.ts" />
import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import prisma from '../lib/prisma';
import { authService } from '../services/auth.service';

jest.mock('../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  financialData: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $queryRaw: jest.fn(),
}));

const generateToken = (userId: string = 'owner-id', email: string = 'owner@test.com') =>
  authService.generateAccessToken({
    userId,
    username: 'testowner',
    email,
  });

describe('Financial Data API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/financial', () => {
    const validPayload = {
      accountType: 'savings',
      institutionName: 'Test Bank Inc.',
      balance: 9999.99,
      dataSource: 'manual',
    };

    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/financial')
        .send(validPayload);

      expect(response.status).toBe(401);
    });

    it('should create financial data with valid auth and payload', async () => {
      const token = generateToken();

      (prisma.financialData.create as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'owner-id',
        ...validPayload,
        currency: 'USD',
        isEncrypted: false,
        accountNumber: null,
        encryptionKeyId: null,
        metadata: null,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/financial')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.institutionName).toBe(validPayload.institutionName);
      expect(response.body.data.accountType).toBe(validPayload.accountType);
      expect(prisma.financialData.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for missing required fields', async () => {
      const token = generateToken();

      const response = await request(app)
        .post('/api/financial')
        .set('Authorization', `Bearer ${token}`)
        .send({ institutionName: 'Only bank name' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should accept custom currency and encryption flags', async () => {
      const token = generateToken();

      const customPayload = {
        ...validPayload,
        currency: 'EUR',
        isEncrypted: true,
        encryptionKeyId: 'kms-abc-123',
      };

      (prisma.financialData.create as jest.Mock).mockResolvedValue({
        id: 'fd-2',
        userId: 'owner-id',
        ...customPayload,
        accountNumber: null,
        metadata: null,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/financial')
        .set('Authorization', `Bearer ${token}`)
        .send(customPayload);

      expect(response.status).toBe(201);
      expect(response.body.data.currency).toBe('EUR');
      expect(response.body.data.isEncrypted).toBe(true);
    });
  });

  describe('GET /api/financial', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app).get('/api/financial');
      expect(response.status).toBe(401);
    });

    it('should list financial data with pagination', async () => {
      const token = generateToken();

      const mockData = [
        { id: 'fd-1', userId: 'owner-id', institutionName: 'Bank A' },
        { id: 'fd-2', userId: 'owner-id', institutionName: 'Bank B' },
      ];

      (prisma.financialData.findMany as jest.Mock).mockResolvedValue(mockData);
      (prisma.financialData.count as jest.Mock).mockResolvedValue(42);

      const response = await request(app)
        .get('/api/financial?page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.limit).toBe(5);
      expect(response.body.data.pagination.total).toBe(42);
      expect(response.body.data.pagination.totalPages).toBe(9);
    });

    it('should apply filters correctly', async () => {
      const token = generateToken();

      (prisma.financialData.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.financialData.count as jest.Mock).mockResolvedValue(0);

      await request(app)
        .get('/api/financial?institutionName=Chase&currency=USD&minBalance=100')
        .set('Authorization', `Bearer ${token}`);

      const whereArg = (prisma.financialData.findMany as jest.Mock).mock.calls[0][0].where;
      expect(whereArg.userId).toBe('owner-id');
      expect(whereArg.institutionName).toEqual({
        contains: 'Chase',
        mode: 'insensitive',
      });
      expect(whereArg.currency).toBe('USD');
      expect(whereArg.balance.gte).toBe(100);
    });
  });

  describe('GET /api/financial/:id', () => {
    it('should return 404 for non-existent record', async () => {
      const token = generateToken();
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/financial/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return 403 when accessing another user\'s record', async () => {
      const token = generateToken('attacker-id');
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'victim-id',
      });

      const response = await request(app)
        .get('/api/financial/fd-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/access denied/i);
    });

    it('should return record when owner accesses it', async () => {
      const token = generateToken('owner-id');
      const record = {
        id: 'fd-owned',
        userId: 'owner-id',
        institutionName: 'My Bank',
        balance: '100.0000',
      };
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue(record);

      const response = await request(app)
        .get('/api/financial/fd-owned')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe('fd-owned');
    });
  });

  describe('PUT /api/financial/:id', () => {
    it('should update own record', async () => {
      const token = generateToken('owner-id');
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'owner-id',
      });
      (prisma.financialData.update as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'owner-id',
        balance: '5000.0000',
      });

      const response = await request(app)
        .put('/api/financial/fd-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ balance: 5000 });

      expect(response.status).toBe(200);
      expect(prisma.financialData.update).toHaveBeenCalledTimes(1);
    });

    it('should return 403 trying to update others\' record', async () => {
      const token = generateToken('attacker-id');
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'owner-id',
      });

      const response = await request(app)
        .put('/api/financial/fd-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ balance: 999999 });

      expect(response.status).toBe(403);
      expect(prisma.financialData.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/financial/:id', () => {
    it('should delete own record successfully', async () => {
      const token = generateToken('owner-id');
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue({
        id: 'fd-1',
        userId: 'owner-id',
      });
      (prisma.financialData.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .delete('/api/financial/fd-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/deleted/i);
      expect(prisma.financialData.delete).toHaveBeenCalledWith({ where: { id: 'fd-1' } });
    });

    it('should return 404 for missing record', async () => {
      const token = generateToken();
      (prisma.financialData.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/financial/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
