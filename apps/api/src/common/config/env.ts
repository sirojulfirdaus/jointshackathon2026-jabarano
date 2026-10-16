import { resolve } from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  WEB_ORIGIN: z.string().url(),
  API_PORT: z.coerce.number().int().positive().default(3000),
  SESSION_COOKIE_NAME: z.string().min(1).default('siapsapa_session'),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
});

export const env = envSchema.parse(process.env);
