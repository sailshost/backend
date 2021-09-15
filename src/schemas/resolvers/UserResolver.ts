import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import { AccountInput } from "../inputs";
import { authenticator } from "otplib";

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

      /*
      if (user.otpSecret !== null && !input!.token) {
        throw new Error("OTP code is required");
      }

      const isValid = authenticator.verify({
        secret: user.otpSecret as string,
        token: input!.token as string,
      });

      if (!isValid) {
        throw new Error("Invalid TOTP");
      }
      */

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
            firstName: input?.lastName,
          },
        });
      }

      return user;
    },
  })
);
