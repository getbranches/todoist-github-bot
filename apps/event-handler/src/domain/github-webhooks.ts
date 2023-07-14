import type { FastifyPluginCallback } from 'fastify';

export const gitHubWebhooks: FastifyPluginCallback = server => {
  server.route<{ Body: unknown }>({
    method: 'POST',
    url: '/webhook',
    handler: (request, reply) => {
      const { body } = request;
      request.log.info(
        {
          body,
          config: request.config,
        },
        'Received webhook',
      );
      
      return reply.code(204).send();
    },
  });
};
