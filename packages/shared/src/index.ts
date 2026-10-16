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

export const SKILLS = ['SOUND_DETECTION', 'SOUND_DISCRIMINATION', 'SOUND_ASSOCIATION'] as const;
export type Skill = (typeof SKILLS)[number];

export const LEARNING_STATES = [
  'NOT_FOCUSED',
  'EXPLORING',
  'PRACTICING',
  'BECOMING_CONSISTENT',
] as const;
export type LearningState = (typeof LEARNING_STATES)[number];

export const PROMPT_LEVELS = [0, 1, 2, 3] as const;
export const DISCRIMINATION_RELATIONS = ['SAME', 'DIFFERENT'] as const;
export type DiscriminationRelation = (typeof DISCRIMINATION_RELATIONS)[number];

export const TRIAL_RESULT_TYPES = [
  'INDEPENDENT_RESPONSE',
  'PROMPTED_RESPONSE',
  'NO_RESPONSE',
  'FALSE_RESPONSE',
  'TECHNICAL_ERROR',
] as const;
export type TrialResultType = (typeof TRIAL_RESULT_TYPES)[number];
