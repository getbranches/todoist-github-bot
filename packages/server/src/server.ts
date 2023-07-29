import { randomUUID } from 'crypto';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySensible from '@fastify/sensible';
import { type FastifyInstance, fastify } from 'fastify';
import { gcpLogOptions } from 'pino-cloud-logging';
import { eventsPlugin } from 'plugin-events-api';
import { managementPlugin } from 'plugin-management-api';
import { type Config, makeConfig } from './config.js';

function makeLoggerOptions(name: string, config: Config) {
  if (config.isDevelopment) {
    return {
      level: 'debug',
      name,
      redact: ['config.WEBHOOK_SECRET'],
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
    redact: ['config.WEBHOOK_SECRET'],
    name,
  });
}

async function makeServer(
  name: string,
  config: Config,
): Promise<FastifyInstance> {
  const app = fastify({
    logger: makeLoggerOptions(name, config),
    genReqId: () => randomUUID(),
  });

  await app.register(fastifySensible);
  await app.register(fastifyRateLimit);

  app.log.debug({ config: { ...config } }, 'Server created');

  return app;
}

export async function makePublicServer(): Promise<FastifyInstance> {
  const config = makeConfig();
  const app = await makeServer('public', config);
  await app.register(eventsPlugin, { secret: config.WEBHOOK_SECRET });
  return app;
}

export async function makeManagementServer(): Promise<FastifyInstance> {
  const config = makeConfig();
  const app = await makeServer('management', config);
  await app.register(managementPlugin);
  return app;
}
