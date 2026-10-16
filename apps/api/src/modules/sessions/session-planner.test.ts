import { describe, expect, it } from 'vitest';
import { createSessionPlan } from './session-planner.js';

describe('createSessionPlan', () => {
  it('uses detection state to introduce association only after practicing', () => {
    expect(createSessionPlan('EXPLORING')).toEqual([
      { skill: 'SOUND_DETECTION', trialCount: 5 },
      { skill: 'SOUND_DISCRIMINATION', trialCount: 3 },
    ]);
    expect(createSessionPlan('PRACTICING')).toContainEqual({
      skill: 'SOUND_ASSOCIATION',
      trialCount: 1,
    });
  });
});
