import { config } from './config.js';
import { makeManagementServer, makePublicServer } from './server.js';

await Promise.all([
  makePublicServer().then(server =>
    server.listen({ host: '0.0.0.0', port: config.PORT }),
  ),
  makeManagementServer().then(server =>
    server.listen({ host: '0.0.0.0', port: config.ADMIN_PORT }),
  ),
]);
