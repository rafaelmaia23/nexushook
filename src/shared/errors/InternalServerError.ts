import { AppError } from '@/shared/errors/AppError';

export class InternalServerError extends AppError {
  constructor(cause?: unknown) {
    super({
      message: 'An internal server error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      action: 'Please contact support if the issue persists',
      cause,
    });
  }
}
