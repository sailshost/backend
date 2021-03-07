import { FastifyInstance, RouteOptions } from "fastify";
import { join } from "path";
import { walk } from "walk";

export async function registerRoutes(server: FastifyInstance) {
  return await new Promise((resolve) => {
    const path = join(`${__dirname}/routes`);
    const files: string[] = [];
    const walker = walk(path);
    walker.on('file', (root, { name }, next) => {
      files.push(join(`${root}/${name}`));
      next();
    });
    walker.on('end', () => {
      for (const file of files) {
        const routes = require(file);
        Object.keys(routes).forEach((key) => {
          let route: RouteOptions = routes[key];
          if (!route || !route.method || !route.handler || !route.url) return;
          route = route as RouteOptions;
          let clean = file.replace(join(`${__dirname}/routes/`), '');
          clean = clean.substr(0, clean.lastIndexOf('.'));
          route.url = `/${clean}${route.url.startsWith('/') ? '' : '/'}${route.url}`;
          route.url = route.url.replace(String.fromCharCode(92), '/');
          if (route.url.includes('/index/')) route.url = route.url.replace('/index/', '');
          server.route(routes[key]);
        });
      }
      return resolve(true);
    });
  });
}
