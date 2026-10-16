import { loginInput, registerParentInput } from '@siapsapa/validation';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { env } from '../../common/config/env.js';
import { parseInput } from '../../common/errors/parse-input.js';
import { requireParent } from '../../common/auth/session.js';
import { loginParent, logoutParent, registerParent } from './auth.service.js';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/api/v1/auth/register', async (request, reply) => {
    const { parent, token } = await registerParent(parseInput(registerParentInput, request.body));
    setSessionCookie(reply, token);
    return reply.status(201).send({ data: parent });
  });

  app.post('/api/v1/auth/login', async (request, reply) => {
    const { parent, token } = await loginParent(parseInput(loginInput, request.body));
    setSessionCookie(reply, token);
    return { data: parent };
  });

  app.post('/api/v1/auth/logout', async (request, reply) => {
    await logoutParent(request.cookies[env.SESSION_COOKIE_NAME]);
    reply.clearCookie(env.SESSION_COOKIE_NAME, { path: '/' });
    return reply.status(204).send();
  });

  app.get('/api/v1/auth/me', async (request) => ({ data: await requireParent(request) }));
}

function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: env.SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}
