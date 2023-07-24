import { config } from './config.js';
import { makeAdminServer, makePublicServer } from './server.js';

const publicServer = await makePublicServer();
const adminServer = await makeAdminServer();

const listen = Promise.all([
  publicServer.listen({ host: '0.0.0.0', port: config.PORT }),
  adminServer.listen({ host: '0.0.0.0', port: config.ADMIN_PORT }),
]);

void (await listen);
