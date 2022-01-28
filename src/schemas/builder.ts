import SchemaBuilder from "@pothos/core";
import { Request, Response } from "express";
import { prisma } from "./prisma";
import { Session, User } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "../../prisma/pothos-types";
import ValidationPlugin from "@pothos/plugin-validation";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import RelayPlugin from "@pothos/plugin-relay";
import ErrorsPlugin from "@pothos/plugin-errors";
import { ValidationError } from "apollo-server-errors";
import { NotFoundError } from "./errors";

export interface Context {
  req: Request;
  res: Response;
  session?: Session | null;
}

export function createGraphQLContext(
  req: Request,
  res: Response,
  session?: Session | null
): Context {
  return {
    req,
    res,
    session,
  };
}

export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: { Input: string; Output: string | number };
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
    unauthenticated: boolean;
  };
}>({
  plugins: [
    PrismaPlugin,
    ErrorsPlugin,
    ValidationPlugin,
    ScopeAuthPlugin,
    RelayPlugin,
  ],
  errorOptions: {
    defaultTypes: [],
  },
  // errorOptions: {
  //   defaultTypes: [ValidationError, NotFoundError],
  // },
  relayOptions: {
    nodeFieldOptions: {},
    nodeQueryOptions: {},
    nodeTypeOptions: {},
    pageInfoFieldOptions: {},
  },
  prisma: {
    client: prisma,
  },
  authScopes: async ({ session }) => ({
    public: true,
    user: !!session,
    unauthenticated: !session,
  }),
});

builder.queryType({
  authScopes: { user: true },
});
builder.mutationType({
  authScopes: { user: true },
});

builder.scalarType("DateTime", {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => {
    return new Date(date);
  },
});
