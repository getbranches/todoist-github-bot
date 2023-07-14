import type { Config } from './config.js';

declare module 'fastify' {
  interface FastifyRequest {
    config: Config;
  }
}
