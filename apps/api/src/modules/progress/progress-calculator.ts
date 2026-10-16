import type { LearningState, Skill, TrialResultType } from '@siapsapa/shared';
import { LEARNING_CONFIG } from '../../common/config/learning-config.js';

export type ProgressTrial = { resultType: TrialResultType };

export type ProgressSnapshot = {
  skill: Skill;
  state: LearningState;
  recentValidTrials: number;
  independentResponses: number;
  promptedResponses: number;
  noResponses: number;
  falseResponses: number;
  independentRate: number | null;
};

export function calculateProgress(
  skill: Skill,
  trials: readonly ProgressTrial[],
): ProgressSnapshot {
  const validTrials = trials
    .filter((trial) => trial.resultType !== 'TECHNICAL_ERROR')
    .slice(-LEARNING_CONFIG.recentTrialWindow);
  const count = (resultType: TrialResultType) =>
    validTrials.filter((trial) => trial.resultType === resultType).length;
  const independentResponses = count('INDEPENDENT_RESPONSE');
  const recentValidTrials = validTrials.length;
  const independentRate = recentValidTrials === 0 ? null : independentResponses / recentValidTrials;

  return {
    skill,
    state: resolveState(skill, recentValidTrials, independentRate),
    recentValidTrials,
    independentResponses,
    promptedResponses: count('PROMPTED_RESPONSE'),
    noResponses: count('NO_RESPONSE'),
    falseResponses: count('FALSE_RESPONSE'),
    independentRate,
  };
}

function resolveState(
  skill: Skill,
  validTrialCount: number,
  independentRate: number | null,
): LearningState {
  if (validTrialCount === 0) {
    return skill === 'SOUND_DETECTION' ? 'EXPLORING' : 'NOT_FOCUSED';
  }
  if (validTrialCount < LEARNING_CONFIG.minimumProgressTrials) return 'EXPLORING';
  if (independentRate! < LEARNING_CONFIG.practicingThreshold) return 'EXPLORING';
  if (independentRate! < LEARNING_CONFIG.consistentThreshold) return 'PRACTICING';
  return 'BECOMING_CONSISTENT';
}
