import { logger } from '@/core/logger/logger';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@/core/errors/AppError';
import { InternalServerError } from '@/core/errors/InternalServerError';
import {
  extractCause,
  type SerializedErrorCause,
} from '../logger/extractErrorCause';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
