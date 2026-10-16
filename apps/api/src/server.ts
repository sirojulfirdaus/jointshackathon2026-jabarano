import { buildApp } from './app/build-app.js';
import { env } from './common/config/env.js';

const app = await buildApp();
await app.listen({ host: '0.0.0.0', port: env.API_PORT });
