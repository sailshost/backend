import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";
import {
  SignupInput,
  LoginInput,
  EnableTOTPInput,
  DisableTOTPInput,
} from "../inputs";
import argon from "argon2";
import {
  createAndDestroy,
  createSession,
  destroySession,
} from "../../utils/session";
import { authenticator } from "otplib";
import { boolean } from "zod";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    firstName: t.exposeString("firstName", { nullable: true }),
    lastName: t.exposeString("lastName", { nullable: true }),
    avatar: t.exposeString("avatar", { nullable: true }),
    otpOnboard: t.exposeString("otpOnboard", { nullable: true }),
    otpSecret: t.exposeString("otpSecret", { nullable: true }),
    containers: t.relation("Containers", {
      resolve: (query, user) =>
        prisma.container.findMany({
          ...query,
          where: { userId: user.id },
        }),
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" })
  }),
});

builder.queryField("me", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    skipTypeScopes: true,
    grantScopes: ["currentUser"],
    resolve: async (query, root, args, { session }) => {
      if (!session?.userId) {
        return null;
      }

      return await prisma.user.findUnique({
        ...query,
        where: { id: session.userId },
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
      unauthenticated: false,
    },
    args: {
      input: t.arg({ type: SignupInput }),
    },
    resolve: async (query, _root, { input }, ctx) => {
      if (!input?.email || !input?.password)
        throw new AuthenticationError("missings_credentials");

      const user = await prisma.user.findUnique({
        ...query,
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

      return account;
    },
  })
);

builder.mutationField("login", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: false,
    },
    args: {
      input: t.arg({ type: LoginInput }),
    },
    // errors: {
    //   types: [ValidationError]
    // },
    resolve: async (query, _root, { input }, { req, session }) => {
      if (!input?.email || !input?.password)
        throw new AuthenticationError("missings_credentials");

      const user = await prisma.user.findUnique({
        ...query,
        where: { email: input.email },
      });

      if (!user) throw new AuthenticationError("invalid_credentials");

      const valid = await argon.verify(user.password, input.password);

      if (!valid) throw new AuthenticationError("invalid_credentials");

      if (user.otpSecret !== null) {
        const isValid = authenticator.verify({
          secret: user.otpSecret,
          token: input!.otp as string,
        });

        if (!input.otp) {
          throw new Error("OTP is required");
        }

        if (!isValid) {
          throw new Error("Invalid TOTP");
        }

        await createAndDestroy({
          req,
          user,
          authType: "OTP",
        });

        return user;
      }

      await createSession(req, user, "FULL");

      return user;
    },
  })
);

builder.queryField("logout", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    resolve: async (query, _root, { input }, { req, res, session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
        rejectOnNotFound: true,
      });

      destroySession(req, session as any);

      return user;
    },
  })
);

builder.queryField("resolveOtp", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
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
        secret: input!.secret,
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
          otpSecret: input!.secret,
          otpBackup: [],
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
