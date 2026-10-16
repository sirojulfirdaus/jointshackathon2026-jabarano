export type ApiSuccess<T> = { data: T; meta?: Record<string, unknown> };

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_STATE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'CONTENT_UNAVAILABLE'
  | 'TRIAL_ALREADY_COMPLETED'
  | 'SESSION_ALREADY_COMPLETED';

export type ApiError = {
  error: { code: ApiErrorCode; message: string; details: unknown[] };
};
