import { ApolloServer } from 'apollo-server-express';
import express from 'express'
// import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from "type-graphql";
import { createContext } from './context';

const app = express();

const main = async () => {

  const schema = await buildSchema({
    emitSchemaFile: true,
    resolvers: [],
    validate: false
  });

  const context = createContext();

  const apolloServer = new ApolloServer({
    introspection: true,
    debug: true,
    context: ({ schema, context, req, res }) => ({ req, res }),
  })
  
  app.listen(4000, () => console.log("🚀 Server is online and ready @ http://localhost:4000/gql"));
}

main().catch((err) => console.error(err));