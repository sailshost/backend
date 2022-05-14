import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import { EnableTOTPInput, DisableTOTPInput } from "../inputs";
import argon from "argon2";
import { createAndDestroy } from "../../utils/session";
import { authenticator } from "otplib";
import { PasswordInput, PasswordRequestInput } from "../inputs/PasswordInput";
import { add } from "date-fns";
import ShortUniqueId from "short-unique-id";
import { Result } from "./ResultResolver";

const uid = new ShortUniqueId();

builder.queryField("resolveOtp", (t) =>
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
    resolve: async (query, _root, { input }, { session }) => {
      let user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
        rejectOnNotFound: true,
      });

      if (user.otpSecret) {
        throw new Error("User already has TOTP enabled.");
      }

      const secret = authenticator.generateSecret();

      user = await prisma.user.update({
        ...query,
        where: {
          id: session!.userId,
        },
        data: {
          otpOnboard: secret,
        },
      });

      return user;
    },
  })
);

builder.mutationField("enableOtp", (t) =>
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
      input: t.arg({ type: EnableTOTPInput }),
    },
    resolve: async (query, _root, { input }, { session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
        rejectOnNotFound: true,
      });

      if (user.otpSecret) {
        throw new Error("User already has TOTP enabled.");
      }

      const isValid = authenticator.verify({
        secret: user!.otpOnboard!,
        token: input!.token,
      });

      if (!isValid) {
        throw new Error("Invalid TOTP");
      }

      await prisma.user.update({
        ...query,
        where: {
          id: session!.userId,
        },
        data: {
          otpSecret: user.otpOnboard,
          otpBackup: [],
          otpType: "GEN",
        },
      });

      return user;
    },
  })
);

builder.mutationField("disableOtp", (t) =>
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
      input: t.arg({ type: DisableTOTPInput }),
    },
    resolve: async (query, _root, { input }, { req, session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
        rejectOnNotFound: true,
      });

      if (!user.otpSecret) throw new Error("TOTP is not enabled.");

      const valid = await argon.verify(user.password, input!.password);

      if (!valid) throw new AuthenticationError("invalid_credentials");

      await prisma.user.update({
        ...query,
        where: {
          id: session!.userId,
        },
        data: {
          otpSecret: null,
          otpBackup: "",
        },
      });

      await createAndDestroy({
        req,
        user,
        authType: "FULL",
      });

      return user;
    },
  })
);

builder.queryField("passwordResetRequest", (t) =>
  t.field({
    type: Result,
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: false,
    },
    errors: {
      types: [Error],
    },
    args: {
      input: t.arg({ type: PasswordRequestInput }),
    },
    resolve: async (parent, { input }, { session }) => {
      if (!input?.email) throw new AuthenticationError("missing_credentials");

      let user = await prisma.user.findUnique({
        where: { email: input!.email },
        rejectOnNotFound: true,
      });

      if (!user) throw new AuthenticationError("invalid_credentials");

      const code = uid.stamp(32);

      await prisma.passwordReset.create({
        data: {
          id: code,
          userId: user.id,
          expiresAt: add(new Date(), { days: 1 }),
        },
      });

      // send email

      console.log("TEST CODE -> ", code);

      return Result.OK;
    },
  })
);

builder.mutationField("passwordReset", (t) =>
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
      input: t.arg({ type: PasswordInput }),
    },
    resolve: async (query, _root, { input }, { req, session }) => {
      type AuthType = "FULL" | "OTP";

      if (!input?.token || !input?.currentPassword || !input?.newPassword)
        throw new AuthenticationError("missing_credentials");

      const token = await prisma.passwordReset.findUnique({
        where: { id: input?.token },
        rejectOnNotFound: true,
      });

      const user = await prisma.user.findUnique({
        ...query,
        where: {
          id: session?.userId,
        },
      });

      if (!user) throw new AuthenticationError("invalid_user");

      if (!token || token.used === true)
        throw new AuthenticationError("invalid_token");

      const valid = await argon.verify(user!.password, input!.currentPassword);

      if (!valid) throw new AuthenticationError("invalid_credentials");

      const hash = await argon.hash(input!.newPassword);

      await prisma.user.update({
        ...query,
        where: {
          id: session?.userId,
        },
        data: {
          password: hash,
        },
      });

      await prisma.passwordReset.update({
        where: {
          id: input!.token,
        },
        data: {
          used: true,
        },
      });

      await createAndDestroy({
        req,
        user,
        authType: session!.type as AuthType,
      });

      return token;
    },
  })
);
