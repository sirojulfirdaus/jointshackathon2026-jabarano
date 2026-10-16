import { describe, expect, it } from 'vitest';
import { calculateProgress } from './progress-calculator.js';

describe('calculateProgress', () => {
  it('keeps detection exploring without results and other skills not focused', () => {
    expect(calculateProgress('SOUND_DETECTION', []).state).toBe('EXPLORING');
    expect(calculateProgress('SOUND_ASSOCIATION', []).state).toBe('NOT_FOCUSED');
  });

  it('excludes technical errors and applies progression thresholds', () => {
    const exploring = calculateProgress('SOUND_DETECTION', [
      { resultType: 'INDEPENDENT_RESPONSE' },
      { resultType: 'NO_RESPONSE' },
      { resultType: 'TECHNICAL_ERROR' },
    ]);
    expect(exploring.recentValidTrials).toBe(2);
    expect(exploring.state).toBe('EXPLORING');

    expect(
      calculateProgress(
        'SOUND_DETECTION',
        Array.from({ length: 5 }, (_, index) => ({
          resultType: index < 3 ? 'INDEPENDENT_RESPONSE' : 'NO_RESPONSE',
        })),
      ).state,
    ).toBe('PRACTICING');

    expect(
      calculateProgress(
        'SOUND_DETECTION',
        Array.from({ length: 5 }, () => ({ resultType: 'INDEPENDENT_RESPONSE' })),
      ).state,
    ).toBe('BECOMING_CONSISTENT');
  });
});
