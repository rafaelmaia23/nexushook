export type AppErrorOptions = {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
  cause?: unknown;
  action?: string;
};

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly cause?: unknown;
  public readonly action?: string;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.name = this.constructor.name;
    this.code = options.code;
    this.statusCode = options.statusCode;

    if (options.details !== undefined) {
      this.details = options.details;
    }

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }

    if (options.action !== undefined) {
      this.action = options.action;
    }

    Error.captureStackTrace?.(this, this.constructor);
  }
}
