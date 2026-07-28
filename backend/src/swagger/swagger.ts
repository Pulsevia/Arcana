/// <reference path="../global.d.ts" />
import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Arcana Backend API',
      version: '1.0.0',
      description:
        'Core backend API for Arcana - secure unlocking and management of financial data',
      contact: {
        name: 'Arcana Team',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cuid123...',
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FinancialDataInput: {
          type: 'object',
          required: ['accountType', 'institutionName', 'balance', 'dataSource'],
          properties: {
            accountNumber: {
              type: 'string',
              maxLength: 100,
              description: 'Encrypted or masked account number',
              example: '****-****-****-1234',
            },
            accountType: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'checking',
              description: 'e.g., checking, savings, investment, credit_card',
            },
            institutionName: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              example: 'Chase Bank',
            },
            balance: {
              type: 'number',
              format: 'decimal',
              example: 15432.89,
              description: 'Current account balance',
            },
            currency: {
              type: 'string',
              pattern: '^[A-Z]{3}$',
              default: 'USD',
              example: 'USD',
              description: 'ISO 4217 currency code',
            },
            dataSource: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'plaid',
              description: 'Source of the financial data (e.g., plaid, manual, csv_import)',
            },
            isEncrypted: {
              type: 'boolean',
              default: false,
              description: 'Whether sensitive fields are encrypted at rest',
            },
            encryptionKeyId: {
              type: 'string',
              maxLength: 100,
              example: 'kms-key-123',
              description: 'Reference to the encryption key used',
            },
            metadata: {
              type: 'object',
              additionalProperties: true,
              description: 'Additional arbitrary metadata',
            },
          },
        },
        FinancialDataUpdateInput: {
          type: 'object',
          properties: {
            accountNumber: {
              type: 'string',
              maxLength: 100,
            },
            accountType: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
            },
            institutionName: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
            },
            balance: {
              type: 'number',
              format: 'decimal',
            },
            currency: {
              type: 'string',
              pattern: '^[A-Z]{3}$',
            },
            dataSource: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
            },
            isEncrypted: {
              type: 'boolean',
            },
            encryptionKeyId: {
              type: 'string',
              maxLength: 100,
            },
            metadata: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
        FinancialData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cuid123...',
            },
            userId: {
              type: 'string',
              example: 'user-cuid...',
            },
            accountNumber: {
              type: 'string',
              nullable: true,
            },
            accountType: {
              type: 'string',
            },
            institutionName: {
              type: 'string',
            },
            balance: {
              type: 'string',
              format: 'decimal',
              example: '15432.8900',
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            dataSource: {
              type: 'string',
            },
            isEncrypted: {
              type: 'boolean',
              default: false,
            },
            encryptionKeyId: {
              type: 'string',
              nullable: true,
            },
            metadata: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
            },
            lastSyncedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
              description: 'Field-specific validation errors',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User registration, login, and token management endpoints',
      },
      {
        name: 'Financial Data',
        description: 'Secure financial data submission, retrieval, and management',
      },
      {
        name: 'Health',
        description: 'Server health and status endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
