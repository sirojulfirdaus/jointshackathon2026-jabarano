import type { ApiErrorCode } from '@siapsapa/shared';

export class AppError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly statusCode: number,
    message: string,
    readonly details: unknown[] = [],
  ) {
    super(message);
  }
}
