import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import { AccountInput } from "../inputs";
import { authenticator } from "otplib";
import { hasOTP } from "../../utils/validate";

builder.mutationField("edit", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    errors: {
      types: [Error],
    },
    args: {
      input: t.arg({ type: AccountInput }),
    },
    resolve: async (query, _root, { input }, { session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
      });

      if (!user) throw new AuthenticationError("invalid_user");

      hasOTP(user, input!.otp as string);

      if (user.firstName) {
        return await prisma.user.update({
          ...query,
          where: {
            id: session?.userId,
          },
          data: {
            firstName: input?.firstName,
          },
        });
      }

      if (user.lastName) {
        return await prisma.user.update({
          ...query,
          where: {
            id: session?.userId,
          },
          data: {
            lastName: input?.lastName,
          },
        });
      }

      return user;
    },
  })
);
