import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (_fastify, _opts) => {};

export const adminPlugin = fastifyPlugin(plugin, {
  fastify: '4.x',
  name: 'admin',
});
