import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import { AccountInput } from "../inputs/AccountInput";

builder.mutationField("edit", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: AccountInput }),
    },
    // errors: {
    //   types: [ValidationError]
    // },
    resolve: async (query, _root, { input }, { session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
      });

      if (!user) throw new AuthenticationError("invalid_user");

      if (user.name) {
        return await prisma.user.update({
          ...query,
          where: {
            id: session?.userId,
          },
          data: {
            name: input?.name,
          },
        });
      }

      return user;
    },
  })
);
