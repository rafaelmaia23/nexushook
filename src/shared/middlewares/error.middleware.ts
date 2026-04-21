import { logger } from '@/shared/logger/logger';
import type { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import { InternalServerError } from '@/shared/errors/InternalServerError';
import { extractCause } from '../logger/extractErrorCause';

export function errorHandler(err: unknown, req: Request, res: Response) {
  const appError = err instanceof AppError ? err : new InternalServerError(err);

  if (appError.statusCode >= 500) {
    logger.error({
      path: req.path,
      method: req.method,
      code: appError.code,
      message: appError.message,
      cause: extractCause(appError.cause),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  return res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      statusCode: appError.statusCode,
      message: appError.message,
      action: appError.action,
      details: appError.details,
    },
  });
}
