import { type FastifyInstance, fastify } from 'fastify';
import { gcpLogOptions } from 'pino-cloud-logging';
import { adminPlugin } from 'plugin-admin';
import { eventsPlugin } from 'plugin-events';
import { config } from './config.js';

export async function makePublicServer(): Promise<FastifyInstance> {
  const app = fastify({
    logger: gcpLogOptions({
      level: config.LOG_LEVEL,
    }),
  });

  await app.register(eventsPlugin);

  return app;
}

export async function makeAdminServer(): Promise<FastifyInstance> {
  const app = fastify({
    logger: gcpLogOptions({
      level: config.LOG_LEVEL,
    }),
  });

  await app.register(adminPlugin);

  return app;
}

