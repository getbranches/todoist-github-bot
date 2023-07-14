import { FastifyInstance, fastify } from 'fastify';
import { gcpLogOptions } from 'pino-cloud-logging';
import { config } from './config.js';
import { gitHubWebhooks } from './domain/github-webhooks.js';

interface MakeServerResponse {
  app: FastifyInstance;
  listen: () => void;
}

export async function makeServer(): Promise<MakeServerResponse> {
  const app = fastify({
    logger: gcpLogOptions({
      level: config.LOG_LEVEL,
    }),
  });

  app.addHook('onRequest', async req => {
    req.config = config;
  });

  app.register(gitHubWebhooks);

  const isGoogleCloudRun = process.env['K_SERVICE'] !== undefined;

  return {
    app,
    listen: () =>
      app.listen({
        port: config.PORT,
        host: isGoogleCloudRun ? '0.0.0.0' : 'localhost',
      }),
  };
}
