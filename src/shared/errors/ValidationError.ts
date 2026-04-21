import { AppError } from '@/shared/errors/AppError';

export class ValidationError extends AppError {
  constructor(
    message = 'A validation error occurred',
    details?: unknown,
    action = 'Please check the input data and try again',
  ) {
    super({
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details,
      action,
    });
  }
}
