import { AuthenticationError } from "apollo-server";
import { builder, Context } from "../builder";
import { prisma } from "../prisma";
import { SignupInput } from "./SignupInput";
import argon from "argon2";
import { LoginInput } from "./LoginInput";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});

builder.mutationField("signup", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      public: true,
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
    resolve: async (query, root, { input }, ctx) => {
      if (!input?.email || !input?.password)
        throw new AuthenticationError("missings_credentials");

      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) throw new AuthenticationError("invalid_credentials");

      const valid = await argon.verify(user.password, input.password);

      if (!valid) throw new AuthenticationError("invalid_credentials");

      ctx.req.session.userId = user.id;

      return user;
    },
  })
);

builder.queryField("test", (t) =>
  t.string({
    resolve: () => "Test mutation",
  })
);
