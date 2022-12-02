import type { FastifyPluginAsync } from 'fastify';

export const gitHubWebhooks: FastifyPluginAsync = async server => {
  server.route({
    method: 'POST',
    url: '/webhook',
    handler: async (request, reply) => {
      const { body } = request;
      request.log.info({ body, config: request.config }, 'Received webhook');
      reply.code(200).send();
    },
  });

  server.route({
    method: 'POST',
    url: '/callback',
    handler: async (request, reply) => {
      const { body } = request;
      request.log.info({ body, config: request.config }, 'Received webhook');
      reply.code(200).send();
    },
  });
};
