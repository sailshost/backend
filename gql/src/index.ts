import { ApolloError, ApolloServer } from 'apollo-server-express';
import express from 'express'
import { buildSchema } from "type-graphql";
import { createContext } from './context';
import cors from "cors";

require('dotenv').config()

const app = express();

const main = async () => {

  app.use(
    cors({
      credentials: true,
      origin: process.env.IS_PROD ? "https://sails.host" : "http://localhost:3000",
    })
  );

  const schema = await buildSchema({
    emitSchemaFile: true,
    resolvers: [],
    validate: false
  });

  const context = createContext();

  const apolloServer = new ApolloServer({
    introspection: true,
    debug: true,
    context: ({ req, res }) => ({ schema, context, req, res }),
    formatError: (error: ApolloError) => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }
      process.env.IS_PROD ? "" : console.log(error);
      return new ApolloError("Internal server error", "INTERNAL_SERVER_ERROR");
    }
  })

  apolloServer.applyMiddleware({
    app,
    path: process.env.IS_PROD ? "/graphql" : "/api/graphql",
    cors: false
  });
  
  app.listen(4000, () => console.log(`🚀 Server is online and ready @ http://localhost:4000/${process.env.IS_PROD ? "graphql" : "api/graphql"}`));
}

main().catch((err) => console.error(err));