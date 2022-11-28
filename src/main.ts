import { makeServer } from './server.js';

const server = await makeServer();
await server.listen();
