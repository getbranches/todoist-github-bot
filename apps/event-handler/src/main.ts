import { makeServer } from './server.js';

const server = await makeServer();
void await server.listen();
