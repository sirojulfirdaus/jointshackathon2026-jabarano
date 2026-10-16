import type { PrismaClient } from '@siapsapa/database';
import { calculateProgress } from './progress-calculator.js';

export async function recalculateChildProgress(
  db: Pick<PrismaClient, 'trialResult' | 'learningProgress'>,
  childId: string,
): Promise<void> {
  const skills = ['SOUND_DETECTION', 'SOUND_DISCRIMINATION', 'SOUND_ASSOCIATION'] as const;
  for (const skill of skills) {
    const results = await db.trialResult.findMany({
      where: {
        resultType: { not: 'TECHNICAL_ERROR' },
        trial: { activity: { session: { childId }, skill } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { resultType: true },
    });
    const snapshot = calculateProgress(skill, results);
    await db.learningProgress.upsert({
      where: { childId_skill: { childId, skill } },
      create: {
        childId,
        skill,
        state: snapshot.state,
        recentValidTrials: snapshot.recentValidTrials,
        independentResponses: snapshot.independentResponses,
        promptedResponses: snapshot.promptedResponses,
        noResponses: snapshot.noResponses,
        falseResponses: snapshot.falseResponses,
      },
      update: {
        state: snapshot.state,
        recentValidTrials: snapshot.recentValidTrials,
        independentResponses: snapshot.independentResponses,
        promptedResponses: snapshot.promptedResponses,
        noResponses: snapshot.noResponses,
        falseResponses: snapshot.falseResponses,
      },
    });
  }
}
