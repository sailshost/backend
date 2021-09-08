import SchemaBuilder, { contextCacheSymbol } from "@giraphql/core";
import { Request, Response } from "express";
import { prisma } from "./prisma";
import { Session } from "@prisma/client";
import PrismaPlugin from "@giraphql/plugin-prisma";
import PrismaTypes from "../../prisma/giraphql-types";
import ValidationPlugin from "@giraphql/plugin-validation";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import { Redis } from "ioredis";

export interface Context {
  req: Request & { session: { userId: string } };
  res: Response;
  session?: Session | null;
  redis?: Redis;
}

export function createGraphQLContext(
  request: Request & { session: { userId: string } },
  res: Response,
  session?: Session | null,
  redis?: Redis
): Context {
  return {
    req: request,
    res,
    session,
    redis,
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
    isStaff: boolean;
  };
}>({
  plugins: [PrismaPlugin, ValidationPlugin, ScopeAuthPlugin],
  prisma: {
    client: prisma,
  },
  authScopes: async ({ session }) => ({
    public: true,
    user: !!session,
    unauthenticated: !session,
  }),
});

builder.queryType({});
builder.mutationType({
  authScopes: { user: true },
});

builder.scalarType("DateTime", {
  serialize: (date) => date.toISOString(),
  parseValue: (date) => {
    return new Date(date);
  },
});
