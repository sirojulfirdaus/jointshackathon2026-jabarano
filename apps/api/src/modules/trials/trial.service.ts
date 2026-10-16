import { prisma } from '@siapsapa/database';
import type { SubmitTrialResultInput } from '@siapsapa/validation';
import { AppError } from '../../common/errors/app-error.js';
import { recalculateChildProgress } from '../progress/progress-recalculation.service.js';
import { evaluateTrial } from './trial-evaluator.js';

export async function submitTrialResult(
  parentId: string,
  sessionId: string,
  trialId: string,
  input: SubmitTrialResultInput,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const trial = await tx.trial.findUnique({
        where: { id: trialId },
        include: {
          result: true,
          activity: {
            include: { session: { include: { child: { select: { parentId: true } } } } },
          },
        },
      });
      if (!trial || trial.activity.sessionId !== sessionId) {
        throw new AppError('NOT_FOUND', 404, 'Trial tidak ditemukan.');
      }
      if (trial.activity.session.child.parentId !== parentId) {
        throw new AppError('FORBIDDEN', 403, 'Anda tidak memiliki akses ke data ini.');
      }
      if (trial.activity.session.status !== 'IN_PROGRESS') {
        throw new AppError('INVALID_STATE', 409, 'Session sudah tidak dapat diubah.');
      }

      const values = resultValues(trial, input);
      if (trial.result) {
        if (sameResult(trial.result, values)) return trial.result;
        throw new AppError('TRIAL_ALREADY_COMPLETED', 409, 'Trial sudah memiliki hasil final.');
      }

      const result = await tx.trialResult.create({ data: { trialId, ...values } });
      const remainingTrials = await tx.trial.count({
        where: { activity: { sessionId }, result: null },
      });
      if (remainingTrials === 0) {
        await tx.learningSession.update({
          where: { id: sessionId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
        await recalculateChildProgress(tx, trial.activity.session.childId);
      }
      return result;
    });
  } catch (error) {
    if (!isTrialResultConflict(error)) throw error;

    const existing = await prisma.trialResult.findUnique({
      where: { trialId },
      include: {
        trial: {
          select: {
            trialType: true,
            discriminationRelation: true,
            correctOptionId: true,
          },
        },
      },
    });
    if (existing && sameResult(existing, resultValues(existing.trial, input))) return existing;
    throw new AppError('TRIAL_ALREADY_COMPLETED', 409, 'Trial sudah memiliki hasil final.');
  }
}

function isTrialResultConflict(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function resultValues(trial: Parameters<typeof evaluateTrial>[0], input: SubmitTrialResultInput) {
  const evaluation = evaluateTrial(trial, input);
  return {
    resultType: evaluation.resultType,
    responded: input.technicalError ? null : input.responded,
    promptLevel: input.technicalError ? null : (input.promptLevel ?? null),
    selectedOptionId: input.technicalError ? null : (input.selectedOptionId ?? null),
    selectedRelation: input.technicalError ? null : (input.selectedRelation ?? null),
    isCorrect: evaluation.isCorrect,
    responseTimeMs: input.technicalError ? null : (input.responseTimeMs ?? null),
  };
}

function sameResult(
  existing: {
    resultType: string;
    responded: boolean | null;
    promptLevel: number | null;
    selectedOptionId: string | null;
    selectedRelation: string | null;
    isCorrect: boolean | null;
    responseTimeMs: number | null;
  },
  values: Omit<typeof existing, 'resultType'> & { resultType: string },
) {
  return (
    existing.resultType === values.resultType &&
    existing.responded === values.responded &&
    existing.promptLevel === values.promptLevel &&
    existing.selectedOptionId === values.selectedOptionId &&
    existing.selectedRelation === values.selectedRelation &&
    existing.isCorrect === values.isCorrect &&
    existing.responseTimeMs === values.responseTimeMs
  );
}
