/// <reference path="../../global.d.ts" />
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    authService = new AuthService();
  });

  describe('Password hashing and comparison', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestP@ss1';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should return different hashes for the same password (salt)', async () => {
      const password = 'TestP@ss1';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should return true for matching password', async () => {
      const password = 'TestP@ss1';
      const hash = await authService.hashPassword(password);
      const result = await authService.comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestP@ss1';
      const wrongPassword = 'WrongP@ss1';
      const hash = await authService.hashPassword(password);
      const result = await authService.comparePassword(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should handle empty strings gracefully', async () => {
      const hash = await authService.hashPassword('');
      const result = await authService.comparePassword('', hash);
      expect(result).toBe(true);
    });
  });

  describe('JWT generation and verification', () => {
    const payload = {
      userId: 'test-user-123',
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should generate a valid access token', () => {
      const token = authService.generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should generate a valid refresh token', () => {
      const token = authService.generateRefreshToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify and decode a valid access token', () => {
      const token = authService.generateAccessToken(payload);
      const decoded = authService.verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should include type=refresh in refresh token payload', () => {
      const token = authService.generateRefreshToken(payload);
      const decoded = authService.verifyToken(token);

      expect(decoded.type).toBe('refresh');
      expect(decoded.userId).toBe(payload.userId);
    });

    it('should throw an error for an invalid token', () => {
      expect(() => {
        authService.verifyToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw an error for a malformed token', () => {
      expect(() => {
        authService.verifyToken('not-a-jwt');
      }).toThrow();
    });
  });

  describe('User sanitization', () => {
    it('should remove passwordHash from user object', () => {
      const user = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed-password-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const sanitized = authService.sanitizeUser(user);

      expect(sanitized).not.toHaveProperty('passwordHash');
      expect(sanitized.id).toBe(user.id);
      expect(sanitized.username).toBe(user.username);
      expect(sanitized.email).toBe(user.email);
      expect(sanitized.createdAt).toBe(user.createdAt);
    });

    it('should work with user objects without passwordHash', () => {
      const user = {
        id: 'user-2',
        username: 'testuser2',
        email: 'test2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const sanitized = authService.sanitizeUser(user);

      expect(sanitized.id).toBe(user.id);
      expect(sanitized.username).toBe(user.username);
    });
  });
});
