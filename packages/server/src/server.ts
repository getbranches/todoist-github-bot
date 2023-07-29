import { randomUUID } from 'crypto';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';
import { type FastifyInstance, fastify } from 'fastify';
import { gcpLogOptions } from 'pino-cloud-logging';
import { eventsPlugin } from 'plugin-events-api';
import { managementPlugin } from 'plugin-management-api';
import { config } from './config.js';

function makeLoggerOptions(name: string) {
  if (config.isDevelopment) {
    return {
      level: 'debug',
      name,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    };
  }

  return gcpLogOptions({
    level: config.LOG_LEVEL,
    name,
  });
}

async function makeServer(name: string): Promise<FastifyInstance> {
  const app = fastify({
    logger: makeLoggerOptions(name),
    genReqId: () => randomUUID(),
  });

  await app.register(fastifySensible);
  await app.register(fastifyRateLimit);

  return app;
}

export async function makePublicServer(): Promise<FastifyInstance> {
  const app = await makeServer('public');
  await app.register(eventsPlugin);
  return app;
}

export async function makeManagementServer(): Promise<FastifyInstance> {
  const app = await makeServer('management');
  await app.register(managementPlugin);
  return app;
}
