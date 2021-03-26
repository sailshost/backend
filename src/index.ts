require("dotenv").config();
import "reflect-metadata";
import { ApolloError, ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import config from "./mikro-orm.config";
import Redis from "redis";
import ioredis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { UserResolver } from "./resolvers/user";
import { IS_PROD, SAILS_COOKIE } from "./constants";
import { ContainerResolver } from "./resolvers/container";

const app = express();

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  const RedisStore = connectRedis(session);
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL as string,
  });
  const redis = new ioredis(process.env.REDIS_URL as string);

  app.use(
    cors({
      credentials: true,
      origin: IS_PROD
        ? ["https://sails.host", "https://sailshost.com"]
        : "http://localhost:3000",
    })
  );

  // make my own implementation of this library to allow multiple domains
  app.use(
    session({
      name: SAILS_COOKIE,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: IS_PROD ? true : false,
        domain: IS_PROD ? ".sails.host" : undefined,
      },
      saveUninitialized: false,
      secret: SAILS_COOKIE,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      emitSchemaFile: true,
      resolvers: [UserResolver, ContainerResolver],
      validate: false,
    }),
    introspection: true,
    playground: IS_PROD ? false : true,
    debug: true,
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
    formatError: (error: ApolloError) => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }
      // this should be a sentry log
      IS_PROD ? "" : console.log(error);
      // this should report the sentry error code
      return new ApolloError("Internal server error", "INTERNAL_SERVER_ERROR");
    },
  });

  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: false,
  });

  app.listen(4000, () =>
    console.log("Server is online and ready @ http://localhost:4000/graphql")
  );
};

main().catch((err) => console.error(err));
