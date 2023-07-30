import { verify } from '@octokit/webhooks-methods';
import type { WebhookEvent } from '@octokit/webhooks-types';
import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import fastifyRawBody from 'fastify-raw-body';
import { handleEvent, isSupportedEvent } from 'reconciler';
import { getEventName, getSignature } from './utils.js';

export interface EventsPluginOptions {
  secret: string;
}

const plugin: FastifyPluginAsync<EventsPluginOptions> = async (
  fastify,
  opts,
) => {
  await fastify.register(fastifyRawBody);

  fastify.route<{ Body: WebhookEvent }>({
    method: 'POST',
    url: '/webhook',
    config: { rawBody: true },
    preHandler: async (request, reply) => {
      const signature = getSignature(request.headers);
      if (!signature || !request.rawBody) {
        return reply.code(401).send();
      }

      const rawBody = request.rawBody.toString();
      const matchesSignature = await verify(opts.secret, rawBody, signature);

      if (!matchesSignature) {
        return reply.code(401).send();
      }
    },
    handler: async (request, reply) => {
      const { body, headers } = request;

      const eventName = getEventName(headers);
      request.log.debug({ eventName, body, headers }, 'Received event');

      if (!isSupportedEvent(eventName)) {
        request.log.warn({ eventName }, 'Unsupported event received');
        return reply.code(204).send();
      }

      await handleEvent(eventName, body, request.log)
        .then(() => {
          return reply.code(204).send();
        })
        .catch(() => {
          return reply.code(500).send();
        });
    },
  });
};

export const eventsPlugin = fastifyPlugin(plugin, {
  fastify: '4.x',
  name: 'events',
});
