require("dotenv").config();
import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import cors from "cors";
import schema from "./schemas/index";
import { SAILS_COOKIE, IS_PROD } from "./export";
import session from "express-session";
import Redis from "redis";
import ioredis from "ioredis";
import connectRedis from "connect-redis";
import { createGraphQLContext } from "./schemas/builder";

const app = express();
const port = 4000 | (process.env.PORT as unknown as number);

const start = async () => {
  const RedisStore = connectRedis(session);

  const redisClient = Redis.createClient({ host: process.env.REDIS_IP });

  const redis = new ioredis({ host: process.env.REDIS_IP });

  app.use(
    session({
      name: SAILS_COOKIE,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax",
        httpOnly: true,
        secure: IS_PROD ? true : false,
      },
      saveUninitialized: false,
      secret: SAILS_COOKIE,
      resave: false,
    })
  );

  app.use(
    cors({
      origin: IS_PROD
        ? [
            "https://sails.host",
            "https://sailshost.com",
            "https://dev.sails.host",
            "https://next.sails.host",
          ]
        : ["http://localhost:3000", "https://studio.apollographql.com"],

      credentials: true,
    })
  );

  const server = new ApolloServer({
    schema,
    // @ts-ignore
    context: ({ req, res }) => createGraphQLContext(req, res, session, redis),
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false,
  });

  app.listen(port, () => console.log(`http://localhost:${port}`));
};

start().catch((err) => console.error(err));
