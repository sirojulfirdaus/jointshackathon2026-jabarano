import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import Fastify from 'fastify';
import { registerErrorHandler } from '../common/errors/error-handler.js';
import { env } from '../common/config/env.js';
import { registerAuthRoutes } from '../modules/auth/auth.routes.js';
import { registerTrialRoutes } from '../modules/trials/trial.routes.js';
import { AppError } from '../common/errors/app-error.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cookie);
  await app.register(cors, { credentials: true, origin: env.WEB_ORIGIN });
  await app.register(helmet);
  registerErrorHandler(app);
  app.addHook('onRequest', async (request) => {
    if (
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) &&
      request.headers.origin &&
      request.headers.origin !== env.WEB_ORIGIN
    ) {
      throw new AppError('FORBIDDEN', 403, 'Origin request tidak diizinkan.');
    }
  });
  app.get('/api/v1/health', async () => ({ data: { status: 'ok' } }));
  await app.register(registerAuthRoutes);
  await app.register(registerTrialRoutes);

  return app;
}
