import { describe, expect, it } from 'vitest';
import { evaluateTrial } from './trial-evaluator.js';

describe('evaluateTrial', () => {
  it('evaluates detection and technical failures on the server', () => {
    expect(
      evaluateTrial(
        { trialType: 'DETECTION_SOUND' },
        { responded: true, promptLevel: 0, technicalError: false },
      ),
    ).toEqual({ resultType: 'INDEPENDENT_RESPONSE', isCorrect: true });
    expect(
      evaluateTrial(
        { trialType: 'DETECTION_SILENT' },
        { responded: true, promptLevel: 0, technicalError: false },
      ),
    ).toEqual({ resultType: 'FALSE_RESPONSE', isCorrect: false });
    expect(
      evaluateTrial({ trialType: 'DETECTION_SOUND' }, { responded: false, technicalError: true }),
    ).toEqual({ resultType: 'TECHNICAL_ERROR', isCorrect: null });
  });

  it('evaluates discrimination and association against server data', () => {
    expect(
      evaluateTrial(
        { trialType: 'DISCRIMINATION', discriminationRelation: 'SAME' },
        { responded: true, selectedRelation: 'SAME', promptLevel: 2, technicalError: false },
      ).resultType,
    ).toBe('PROMPTED_RESPONSE');
    expect(
      evaluateTrial(
        { trialType: 'ASSOCIATION', correctOptionId: 'right' },
        { responded: true, selectedOptionId: 'wrong', technicalError: false },
      ).resultType,
    ).toBe('FALSE_RESPONSE');
  });
});
