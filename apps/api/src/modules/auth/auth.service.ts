import argon2 from 'argon2';
import { prisma } from '@siapsapa/database';
import type { LoginInput, RegisterParentInput } from '@siapsapa/validation';
import { env } from '../../common/config/env.js';
import { AppError } from '../../common/errors/app-error.js';
import { createOpaqueToken, hashSessionToken } from '../../common/auth/session.js';

type PublicParent = { id: string; email: string; createdAt: Date };

export async function registerParent(input: RegisterParentInput) {
  const existing = await prisma.parent.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existing) throw new AppError('CONFLICT', 409, 'Email sudah digunakan.');

  const token = createOpaqueToken();
  const parent = await prisma.parent.create({
    data: {
      email: input.email,
      passwordHash: await argon2.hash(input.password, { type: argon2.argon2id }),
      authSessions: { create: { tokenHash: hashSessionToken(token), expiresAt: sessionExpiry() } },
    },
    select: { id: true, email: true, createdAt: true },
  });
  return { parent, token };
}

export async function loginParent(input: LoginInput) {
  const parent = await prisma.parent.findUnique({ where: { email: input.email } });
  if (
    !parent ||
    parent.status !== 'ACTIVE' ||
    !(await argon2.verify(parent.passwordHash, input.password))
  ) {
    throw new AppError('UNAUTHENTICATED', 401, 'Email atau password tidak valid.');
  }

  const token = createOpaqueToken();
  await prisma.authSession.create({
    data: { parentId: parent.id, tokenHash: hashSessionToken(token), expiresAt: sessionExpiry() },
  });
  const publicParent: PublicParent = {
    id: parent.id,
    email: parent.email,
    createdAt: parent.createdAt,
  };
  return { parent: publicParent, token };
}

export async function logoutParent(token: string | undefined) {
  if (!token) return;
  await prisma.authSession.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}

function sessionExpiry() {
  return new Date(Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}
