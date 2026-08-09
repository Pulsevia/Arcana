/// <reference path="../../global.d.ts" />
import { registerSchema, loginSchema } from '../validation/auth.validation';
import { ZodError } from 'zod';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    const validData = {
      username: 'valid_user123',
      email: 'valid@example.com',
      password: 'SecureP@ss1',
    };

    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('valid_user123');
        expect(result.data.email).toBe('valid@example.com');
      }
    });

    it('should trim username and normalize email to lowercase', () => {
      const result = registerSchema.safeParse({
        username: '  spaced_user  ',
        email: '  MixedCase@Example.COM  ',
        password: 'SecureP@ss1',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe('spaced_user');
        expect(result.data.email).toBe('mixedcase@example.com');
      }
    });

    it('should reject username shorter than 3 chars', () => {
      const result = registerSchema.safeParse({
        ...validData,
        username: 'ab',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasUsernameError = result.error.issues.some(
          (i: { path: (string | number)[] }) => i.path[0] === 'username'
        );
        expect(hasUsernameError).toBe(true);
      }
    });

    it('should reject username with invalid characters', () => {
      const result = registerSchema.safeParse({
        ...validData,
        username: 'invalid-user!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const result = registerSchema.safeParse({
        ...validData,
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasEmailError = result.error.issues.some(
          (i: { path: (string | number)[] }) => i.path[0] === 'email'
        );
        expect(hasEmailError).toBe(true);
      }
    });

    it('should reject password shorter than 8 chars', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'Sh0rt!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password missing uppercase', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'weakp@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password missing number', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'WeakP@ssword',
      });
      expect(result.success).toBe(false);
    });

    it('should reject password missing special character', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'WeakPass1',
      });
      expect(result.success).toBe(false);
    });

    it('should throw ZodError on parse with invalid data', () => {
      expect(() => registerSchema.parse({ username: 'x' })).toThrow(ZodError);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'AnyPass123!',
      });
      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const result = loginSchema.safeParse({
        email: '  USER@Example.COM  ',
        password: 'AnyPass123!',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({ password: 'pass' });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-email',
        password: 'pass',
      });
      expect(result.success).toBe(false);
    });
  });
});
