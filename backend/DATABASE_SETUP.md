# Database Integration Guide

## Overview
We've integrated **PostgreSQL** with **Prisma ORM** for the Arcana backend, providing type-safe, persistent data storage.

## Files Created/Modified

### New Files
- `backend/prisma/schema.prisma`: Prisma schema defining User, Profile, and Transaction models
- `backend/.env`: Database environment variables (gitignored)
- `backend/.env.example`: Example env file
- `backend/src/lib/prisma.ts`: Prisma client setup
- `backend/src/index.ts`: Updated backend with database endpoints

### Modified Files
- `backend/package.json`: Added Prisma dependencies and scripts
- `backend/tsconfig.json`: Updated to use src directory

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up PostgreSQL Database
- Install PostgreSQL locally or use a service like Supabase, Railway, etc.
- Create a database named `arcana_db`
- Update `backend/.env` with your database URL:
  ```
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/arcana_db?schema=public"
  ```

### 3. Initialize Prisma
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start the Server
```bash
npm run dev
```

## Available Scripts
- `npm run db:generate`: Generate TypeScript types from Prisma schema
- `npm run db:push`: Push schema changes directly to database
- `npm run db:migrate`: Create and apply migrations (recommended for production)
- `npm run db:studio`: Open Prisma Studio (GUI for database management)

## Database Schema

### User
- `id`: Unique ID (CUID)
- `username`: Unique username
- `email`: Unique email
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- `profile`: Optional associated profile

### Profile
- `id`: Unique ID
- `userId`: Associated user ID (unique)
- `displayName`: Display name
- `bio`: Optional bio
- `avatarUrl`: Optional avatar URL
- `tags`: Array of tags
- `model3d`: 3D asset metadata (embedded type)
- `createdAt`/`updatedAt`: Timestamps

### Transaction
- `id`: Unique ID
- `userId`: Associated user ID
- `type`: Transaction type
- `amount`: Transaction amount
- `currency`: Currency code
- `status`: Transaction status
- `hash`: Optional transaction hash
- `metadata`: Optional JSON metadata
- `createdAt`/`updatedAt`: Timestamps

## API Endpoints

### Health Check
- `GET /health`: Checks server and database status

### Users
- `GET /users`: Get all users with profiles
- `POST /users`: Create new user

### Transactions
- `GET /transactions`: Get all transactions
- `POST /transactions`: Create new transaction
