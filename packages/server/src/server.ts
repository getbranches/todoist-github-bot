import { type FastifyInstance, fastify } from 'fastify';
import { gcpLogOptions } from 'pino-cloud-logging';
import { eventsPlugin } from 'plugin-events-api';
import { managementPlugin } from 'plugin-management-api';
import { config } from './config.js';

async function makeServer(): Promise<FastifyInstance> {
  const app = fastify({
    logger: gcpLogOptions({
      level: config.LOG_LEVEL,
    }),
  });

  return app;
}

export async function makePublicServer(): Promise<FastifyInstance> {
  const app = await makeServer();

  await app.register(eventsPlugin);

  return app;
}

export async function makeManagementServer(): Promise<FastifyInstance> {
  const app = await makeServer();

  await app.register(managementPlugin);

  return app;
}
