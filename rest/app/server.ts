import fastify from 'fastify';
import cors from 'fastify-cors';
import { registerRoutes } from './loader';

const server = fastify({ logger: true });

export async function startServer() {
  server.register(cors, {
    // options here
  })
  await registerRoutes(server);
  server.ready().then(() => console.log(server.printRoutes()));
  return await server.listen(1337, '0.0.0.0');
}
