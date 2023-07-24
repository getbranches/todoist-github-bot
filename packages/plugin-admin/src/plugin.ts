import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

// TODO: implement plugin
// eslint-disable-next-line @typescript-eslint/no-empty-function
const plugin: FastifyPluginAsync = async (_fastify, _opts) => {};

export const adminPlugin = fastifyPlugin(plugin, {
  fastify: '4.x',
  name: 'admin',
});
