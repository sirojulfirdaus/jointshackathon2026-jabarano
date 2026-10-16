import type { LearningState, Skill } from '@siapsapa/shared';
import { LEARNING_CONFIG } from '../../common/config/learning-config.js';

export type SessionPlan = { skill: Skill; trialCount: number }[];

export function createSessionPlan(detectionState: LearningState): SessionPlan {
  const state = detectionState === 'NOT_FOCUSED' ? 'EXPLORING' : detectionState;
  const mix = LEARNING_CONFIG.sessionPlans[state];
  return (Object.entries(mix) as [Skill, number][])
    .filter(([, trialCount]) => trialCount > 0)
    .map(([skill, trialCount]) => ({ skill, trialCount }));
}
