require("dotenv").config();
import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import cors from "cors";
import schema from "./schemas/index";
import { IS_PROD } from "./export";
import Redis from "redis";
import { createGraphQLContext } from "./schemas/builder";
import { ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { ironSession } from "next-iron-session";
import { getSession, sessionOptions } from "./utils/session";
import { graphqlUploadExpress } from "graphql-upload";

const app = express();
const port = 4000 || (process.env.PORT as unknown as number);

const start = async () => {
  // const redis = Redis.createClient({ host: process.env.REDIS_IP });

  app.use(ironSession(sessionOptions));

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

  app.use(graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 2 }));

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) =>
      createGraphQLContext(req, res, await getSession(req, res)),
    plugins: IS_PROD ? [ApolloServerPluginLandingPageDisabled()] : [],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false,
  });

  app.listen(port, () => console.log(`http://localhost:${port}`));
};

start().catch((err) => console.error(err.stack));
