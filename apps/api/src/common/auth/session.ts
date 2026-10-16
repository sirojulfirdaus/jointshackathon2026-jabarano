import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@siapsapa/database';
import type { FastifyRequest } from 'fastify';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

export type AuthenticatedParent = { id: string; email: string; createdAt: Date };

export function createOpaqueToken() {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function requireParent(request: FastifyRequest): Promise<AuthenticatedParent> {
  const token = request.cookies[env.SESSION_COOKIE_NAME];
  if (!token) throw new AppError('UNAUTHENTICATED', 401, 'Autentikasi diperlukan.');

  const session = await prisma.authSession.findFirst({
    where: {
      tokenHash: hashSessionToken(token),
      expiresAt: { gt: new Date() },
      parent: { status: 'ACTIVE' },
    },
    select: { id: true, parent: { select: { id: true, email: true, createdAt: true } } },
  });
  if (!session) throw new AppError('UNAUTHENTICATED', 401, 'Autentikasi diperlukan.');

  await prisma.authSession.update({ where: { id: session.id }, data: { lastUsedAt: new Date() } });
  return session.parent;
}
