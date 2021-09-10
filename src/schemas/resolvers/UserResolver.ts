import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import { SignupInput, LoginInput } from "../inputs";
import argon from "argon2";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    skipTypeScopes: true,
    grantScopes: ["currentUser"],
    resolve: async (query, root, args, ctx) => {
      if (!ctx.req.session?.userId) {
        return null;
      }

      return await prisma.user.findUnique({
        ...query,
        where: { id: ctx.req.session.userId },
        rejectOnNotFound: true,
      });
    },
  })
);

builder.mutationField("signup", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true,
    },
    args: {
      input: t.arg({ type: SignupInput }),
    },
    resolve: async (query, root, { input }, ctx) => {
      if (!input?.email || !input?.password)
        throw new AuthenticationError("missings_credentials");

      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (user) throw new AuthenticationError("failed_to_create_account");

      const hash = await argon.hash(input.password);

      const account = await prisma.user.create({
        data: {
          email: input.email,
          password: hash,
        },
      });

      ctx.req.session.userId = account.id;

      return account;
    },
  })
);

builder.mutationField("login", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      public: true,
    },
    args: {
      input: t.arg({ type: LoginInput }),
    },
    // errors: {
    //   types: [ValidationError]
    // },
    resolve: async (_query, _root, { input }, ctx) => {
      if (!input?.email || !input?.password)
        throw new AuthenticationError("missings_credentials");

      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) throw new AuthenticationError("invalid_credentials");

      const valid = await argon.verify(user.password, input.password);

      if (!valid) throw new AuthenticationError("invalid_credentials");

      ctx.req.session.userId = user.id;
      console.log(ctx.req.session);

      return user;
    },
  })
);

builder.queryField("test", (t) =>
  t.string({
    resolve: () => "Test query",
  })
);
