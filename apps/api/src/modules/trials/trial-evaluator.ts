import type { DiscriminationRelation, TrialResultType } from '@siapsapa/shared';

export type TrialForEvaluation = {
  trialType: 'DETECTION_SOUND' | 'DETECTION_SILENT' | 'DISCRIMINATION' | 'ASSOCIATION';
  discriminationRelation?: DiscriminationRelation | null;
  correctOptionId?: string | null;
};

export type TrialSubmission = {
  responded: boolean;
  promptLevel?: number | null;
  selectedOptionId?: string | null;
  selectedRelation?: DiscriminationRelation | null;
  technicalError: boolean;
};

export type EvaluatedTrial = { resultType: TrialResultType; isCorrect: boolean | null };

export function evaluateTrial(
  trial: TrialForEvaluation,
  submission: TrialSubmission,
): EvaluatedTrial {
  if (submission.technicalError) return { resultType: 'TECHNICAL_ERROR', isCorrect: null };

  const isCorrect = evaluateCorrectness(trial, submission);
  if (!submission.responded && trial.trialType !== 'DETECTION_SILENT') {
    return { resultType: 'NO_RESPONSE', isCorrect: false };
  }
  if (!isCorrect) return { resultType: 'FALSE_RESPONSE', isCorrect: false };
  return {
    resultType:
      submission.promptLevel && submission.promptLevel > 0
        ? 'PROMPTED_RESPONSE'
        : 'INDEPENDENT_RESPONSE',
    isCorrect: true,
  };
}

function evaluateCorrectness(trial: TrialForEvaluation, submission: TrialSubmission): boolean {
  switch (trial.trialType) {
    case 'DETECTION_SOUND':
      return submission.responded;
    case 'DETECTION_SILENT':
      return !submission.responded;
    case 'DISCRIMINATION':
      return submission.responded && submission.selectedRelation === trial.discriminationRelation;
    case 'ASSOCIATION':
      return submission.responded && submission.selectedOptionId === trial.correctOptionId;
  }
}
