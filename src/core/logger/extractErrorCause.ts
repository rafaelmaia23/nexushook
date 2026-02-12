import { AppError } from '@/core/errors/AppError';

export type SerializedErrorCause =
  | {
      code: string;
      message: string;
      cause?: SerializedErrorCause;
    }
  | {
      name: string;
      message: string;
    }
  | string
  | undefined;

export function extractCause(err: unknown): SerializedErrorCause {
  if (!err) return undefined;

  if (err instanceof AppError) {
    return {
      code: err.code,
      message: err.message,
      cause: extractCause(err.cause),
    };
  }

  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
    };
  }

  return String(err);
}
