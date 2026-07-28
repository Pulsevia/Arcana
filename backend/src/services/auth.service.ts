/// <reference path="../global.d.ts" />
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'arcana-dev-secret-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign({ ...payload, type: 'refresh' }, this.jwtSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
    });
  }

  verifyToken(token: string): JwtPayload & { type?: string; iat: number; exp: number } {
    return jwt.verify(token, this.jwtSecret) as JwtPayload & {
      type?: string;
      iat: number;
      exp: number;
    };
  }

  sanitizeUser(user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    passwordHash?: string;
  }) {
    const { passwordHash: _passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
