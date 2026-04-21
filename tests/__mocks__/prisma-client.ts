import { jest } from '@jest/globals';

export const PrismaClient = jest.fn().mockImplementation(() => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));
