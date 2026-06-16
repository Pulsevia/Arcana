# Arcana Backend API Documentation

## Base URL
`http://localhost:3001`

---

## Authentication Endpoints

### Register User
**POST** `/api/users/register`

Request Body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response (201 Created):
```json
{
  "user": {
    "id": "cuid...",
    "username": "john_doe",
    "email": "john@example.com",
    "profile": null
  },
  "token": "jwt_token_here"
}
```

### Login User
**POST** `/api/users/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response (200 OK):
```json
{
  "user": {
    "id": "cuid...",
    "username": "john_doe",
    "email": "john@example.com",
    "profile": null
  },
  "token": "jwt_token_here"
}
```

### Get All Users
**GET** `/api/users`

Response (200 OK):
```json
{
  "users": [
    {
      "id": "cuid...",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User By ID
**GET** `/api/users/:id`

---

## Transaction Endpoints

### Create Transaction
**POST** `/api/transactions`

Request Body:
```json
{
  "userId": "cuid...",
  "type": "deposit",
  "amount": 100.50,
  "currency": "ETH",
  "status": "completed",
  "hash": "0x..."
}
```

Transaction Types: `deposit`, `withdraw`, `transfer`, `swap`
Transaction Status: `pending`, `completed`, `failed`, `cancelled`

Response (201 Created):
```json
{
  "transaction": {
    "id": "cuid...",
    "userId": "cuid...",
    "type": "deposit",
    "amount": 100.5,
    "currency": "ETH",
    "status": "completed",
    "hash": "0x...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Transactions
**GET** `/api/transactions`

### Get Transaction By ID
**GET** `/api/transactions/:id`

### Get Transactions By User ID
**GET** `/api/transactions/user/:userId`

---

## Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45
}
```
