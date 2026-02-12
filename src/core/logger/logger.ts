import { config } from '@/config/config';
import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
  level: config.logger.level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});
