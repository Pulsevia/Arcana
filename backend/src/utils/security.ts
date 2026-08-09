/// <reference path="../global.d.ts" />
import { webcrypto } from 'crypto';

const crypto = webcrypto;

export const sanitizeInput = <T>(input: T): T => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '') as unknown as T;
};

export const maskAccountNumber = (accountNumber: string | null): string | null => {
  if (!accountNumber) return null;
  const clean = accountNumber.replace(/\s|-/g, '');
  if (clean.length <= 4) return '****';
  const last4 = clean.slice(-4);
  return `****-****-****-${last4}`;
};

export const validateCurrencyCode = (code: string): boolean => {
  const iso4217 = /^[A-Z]{3}$/;
  return iso4217.test(code);
};

export const generateSecureId = (prefix: string = '', length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    const rand = new Uint32Array(1);
    crypto.getRandomValues(rand);
    result += chars.charAt(rand[0] % chars.length);
  }
  return result;
};

export const asyncHandler = <T>(
  fn: (...args: unknown[]) => Promise<T>
): ((...args: unknown[]) => Promise<T | void>) => {
  return async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const next = args[args.length - 1] as (err: Error) => void;
      if (typeof next === 'function') {
        next(error as Error);
      }
      throw error;
    }
  };
};
