/// <reference path="../../global.d.ts" />
import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import prisma from '../lib/prisma';
import { authService } from '../services/auth.service';

jest.mock('../lib/prisma', () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
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

describe('Auth API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validPayload = {
      username: 'testuser_integ',
      email: 'integ@example.com',
      password: 'SecureP@ss1',
    };

    it('should register a new user successfully', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: 'cuid-new-user',
          username: data.username,
          email: data.email,
          passwordHash: data.passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.username).toBe(validPayload.username);
      expect(response.body.data.user.email).toBe(validPayload.email);
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 on invalid registration data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'x', email: 'bad', password: 'weak' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
    });

    it('should return 409 on duplicate username', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        username: validPayload.username,
        email: 'other@example.com',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(409);
      expect(response.body.status).toBe('error');
      expect(response.body.errors.username).toBeDefined();
    });

    it('should return 409 on duplicate email', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        username: 'different_user',
        email: validPayload.email,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(409);
      expect(response.body.errors.email).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    const loginPayload = {
      email: 'login@example.com',
      password: 'SecureP@ss1',
    };

    it('should return 401 for non-existent email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginPayload);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should return 401 for incorrect password', async () => {
      const differentHash = await authService.hashPassword('DifferentP@ss9');
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id',
        username: 'testuser',
        email: loginPayload.email,
        passwordHash: differentHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginPayload);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'only@here.com' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/authentication/i);
    });

    it('should return 401 with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'MalformedToken');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid Bearer token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
    });

    it('should return user data with valid access token', async () => {
      const token = authService.generateAccessToken({
        userId: 'user-id-123',
        username: 'validuser',
        email: 'valid@example.com',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id-123',
        username: 'validuser',
        email: 'valid@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: null,
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.id).toBe('user-id-123');
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });
  });
});
