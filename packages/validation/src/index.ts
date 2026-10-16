import { DISCRIMINATION_RELATIONS, PROMPT_LEVELS } from '@siapsapa/shared';
import { z } from 'zod';

export { z };

const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128);

export const registerParentInput = z.object({ email, password });
export const loginInput = z.object({ email, password });

export const submitTrialResultInput = z
  .object({
    responded: z.boolean(),
    promptLevel: z
      .union(PROMPT_LEVELS.map((level) => z.literal(level)))
      .nullable()
      .optional(),
    selectedOptionId: z.string().uuid().nullable().optional(),
    selectedRelation: z.enum(DISCRIMINATION_RELATIONS).nullable().optional(),
    responseTimeMs: z.number().int().min(0).max(300_000).nullable().optional(),
    technicalError: z.boolean().default(false),
  })
  .strict();

export const sessionIdParams = z.object({ sessionId: z.string().uuid() });
export const trialResultParams = sessionIdParams.extend({ trialId: z.string().uuid() });

export type RegisterParentInput = z.infer<typeof registerParentInput>;
export type LoginInput = z.infer<typeof loginInput>;
export type SubmitTrialResultInput = z.infer<typeof submitTrialResultInput>;
