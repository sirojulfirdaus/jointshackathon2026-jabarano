import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify from 'fastify';
import { env } from '../common/config/env.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cookie);
  await app.register(cors, { credentials: true, origin: env.WEB_ORIGIN });
  await app.register(helmet);
  app.get('/api/v1/health', async () => ({ data: { status: 'ok' } }));

  return app;
}
