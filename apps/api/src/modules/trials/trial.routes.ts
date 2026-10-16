import { submitTrialResultInput, trialResultParams } from '@siapsapa/validation';
import type { FastifyInstance } from 'fastify';
import { requireParent } from '../../common/auth/session.js';
import { parseInput } from '../../common/errors/parse-input.js';
import { submitTrialResult } from './trial.service.js';

export async function registerTrialRoutes(app: FastifyInstance) {
  app.put('/api/v1/sessions/:sessionId/trials/:trialId/result', async (request) => {
    const parent = await requireParent(request);
    const { sessionId, trialId } = parseInput(trialResultParams, request.params);
    const result = await submitTrialResult(
      parent.id,
      sessionId,
      trialId,
      parseInput(submitTrialResultInput, request.body),
    );
    return { data: result };
  });
}
