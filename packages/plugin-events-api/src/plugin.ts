import * as githubWebhookSchema from '@octokit/webhooks-schemas';
import type { WebhookEvent } from '@octokit/webhooks-types';
import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { handleEvent, isSupportedEvent } from 'reconciler';

const plugin: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.route<{ Body: WebhookEvent }>({
    method: 'POST',
    url: '/webhook',
    handler: (request, reply) => {
      try {
        const { body, headers } = request;
        const eventName = headers['x-github-event'];
        if (isSupportedEvent(eventName)) {
          return reply.code(400).send();
        }

        handleEvent()

        return reply.code(204).send();
      } catch {
        return reply.code(400).send();
      }
    },
  });
};

export const eventsPlugin = fastifyPlugin(plugin, {
  fastify: '4.x',
  name: 'events',
});
