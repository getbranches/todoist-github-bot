import { verify } from '@octokit/webhooks-methods';
import type { WebhookEvent } from '@octokit/webhooks-types';
import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { handleEvent, isSupportedEvent } from 'reconciler';
import { getEventName, getSignature } from './utils.js';

export interface EventsPluginOptions {
  secret: string;
}

const plugin: FastifyPluginAsync<EventsPluginOptions> = async (
  fastify,
  opts,
) => {
  fastify.route<{ Body: WebhookEvent }>({
    method: 'POST',
    url: '/webhook',
    handler: async (request, reply) => {
      const { body, headers } = request;

      const eventName = getEventName(headers);
      const signature = getSignature(headers);

      if (!isSupportedEvent(eventName) || !signature) {
        return reply.code(400).send();
      }

      const matchesSignature = await verify(
        opts.secret,
        JSON.stringify(body),
        signature,
      );

      if (!matchesSignature) {
        return reply.code(401).send();
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
