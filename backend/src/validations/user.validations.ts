import { z } from 'zod';

export const registerUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
