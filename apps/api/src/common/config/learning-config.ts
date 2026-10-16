import type { LearningState, Skill } from '@siapsapa/shared';

export const LEARNING_CONFIG = {
  recentTrialWindow: 10,
  minimumProgressTrials: 5,
  practicingThreshold: 0.5,
  consistentThreshold: 0.8,
  promptLevelMin: 0,
  promptLevelMax: 3,
  sessionPlans: {
    EXPLORING: { SOUND_DETECTION: 5, SOUND_DISCRIMINATION: 3, SOUND_ASSOCIATION: 0 },
    PRACTICING: { SOUND_DETECTION: 4, SOUND_DISCRIMINATION: 3, SOUND_ASSOCIATION: 1 },
    BECOMING_CONSISTENT: { SOUND_DETECTION: 3, SOUND_DISCRIMINATION: 3, SOUND_ASSOCIATION: 2 },
  } as const satisfies Record<Exclude<LearningState, 'NOT_FOCUSED'>, Record<Skill, number>>,
} as const;
