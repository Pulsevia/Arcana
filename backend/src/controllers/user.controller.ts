import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { RegisterUserInput, LoginUserInput } from '../validations/user.validations';

const JWT_SECRET = process.env.JWT_SECRET || 'arcana-secret-key-change-in-production';

export const registerUser = async (req: Request<{}, {}, RegisterUserInput>, res: Response) => {
  const { username, email, password } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return res.status(409).json({ error: 'User with email or username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    include: {
      profile: true,
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
    token,
  });
};

export const loginUser = async (req: Request<{}, {}, LoginUserInput>, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
    token,
  });
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
  });

  res.json({ users });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
};
