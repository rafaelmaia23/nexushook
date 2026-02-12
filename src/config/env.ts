import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '@/core/logger/logger';

const appEnv = process.env.APP_ENV ?? 'development';

dotenv.config({
  path: `.env.${appEnv}`,
});

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive(),

  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().int().positive(),

  LOGGER_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(
    z.treeifyError(parsedEnv.error),
    '❌ Invalid environment variables:',
  );
  process.exit(1);
}

export const env = parsedEnv.data;
