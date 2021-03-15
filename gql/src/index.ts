import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloError, ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import express from "express"
import { buildSchema } from "type-graphql";
import cors from "cors";
import config from "./mikro-orm.config";
import Redis from "redis";
import ioredis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { UserResolver } from "./resolvers/user";
import { SAILS_COOKIE } from "./constants";
require('dotenv-safe').config();

const app = express();

const main = async () => {
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();

  const RedisStore = connectRedis(session);
  const redisClient = Redis.createClient({ host: process.env.IP as string });
  const redis = new ioredis({ host: process.env.IP as string });

  app.use(
    cors({
      credentials: true,
      origin: process.env.IS_PROD === true ? "https://sails.host" : "http://localhost:3000",
    })
  );

  app.use(
    session({
      name: SAILS_COOKIE,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.IS_PROD === true ? true : false,
        domain: process.env.IS_PROD === true ? ".sails.host" : undefined,
      },
      saveUninitialized: false,
      secret: SAILS_COOKIE,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      emitSchemaFile: true,
      resolvers: [UserResolver],
      validate: false
    }),
    introspection: true,
    debug: true,
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
    formatError: (error: ApolloError) => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }
      process.env.IS_PROD === true ? "" : console.log(error);
      return new ApolloError("Internal server error", "INTERNAL_SERVER_ERROR");
    }
  })

  apolloServer.applyMiddleware({
    app,
    path: process.env.IS_PROD === true ? "/api/graphql" : "/graphql",
    cors: false
  });
  
  app.listen(4000, () => console.log(`🚀 Server is online and ready @ http://localhost:4000/${process.env.IS_PROD ? "graphql" : "api/graphql"}`));
}

main().catch((err) => console.error(err));