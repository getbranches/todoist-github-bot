import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.route<{ Body: unknown }>({
    method: 'POST',
    url: '/webhook',
    handler: (request, reply) => {
      const { body } = request;
      request.log.info({ body }, 'Received webhook');
      return reply.code(204).send();
    },
  });
};

export const eventsPlugin = fastifyPlugin(plugin, {
  fastify: '4.x',
  name: 'events',
});
