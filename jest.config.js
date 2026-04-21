/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },

  moduleNameMapper: {
    '@/generated/prisma/client': '<rootDir>/tests/__mocks__/prisma-client.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',

  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
};

export default config;
