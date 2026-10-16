import type { z } from 'zod';
import { AppError } from './app-error.js';

export function parseInput<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  throw new AppError('VALIDATION_ERROR', 400, 'Request tidak valid.', result.error.issues);
}
