import { prisma } from "../schemas/prisma";
import { Session, User } from "@prisma/client";
import { applySession, ironSession, SessionOptions } from "next-iron-session";
import { IS_PROD, SAILS_COOKIE } from "../export";
import { addSeconds, differenceInSeconds } from "date-fns";
import { Request, Response } from "express";
import ip from "request-ip";

if (!process.env.PASSWORD)
  console.warn("There was no environment variable set for `PASSWORD`");

const SESSION_TTL = 15 * 24 * 3600;

interface RequestWithSession extends Request {
  session: import("next-iron-session").Session;
}

export const sessionOptions: SessionOptions = {
  password: [
    {
      id: 1,
      password: process.env.PASSWORD,
    },
  ],
  cookieName: SAILS_COOKIE,
  cookieOptions: {
    secure: true, //IS_PROD ? true : false,
    sameSite: "none", // "lax"
    httpOnly: true,
  },
};

type AuthType = "FULL" | "OTP";

// @TODO: replace all types with options type
interface Options {
  req: Request;
  user?: User;
  Session?: Session;
  authType?: AuthType;
}

export async function createSession(
  req: Request,
  user: User,
  authType: AuthType
): Promise<void | unknown> {
  // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: addSeconds(new Date(), SESSION_TTL),
      ip: ip.getClientIp(req) as any,
      userAgent: req.headers["user-agent"] as string,
      type: authType,
    },
  });

  const requestWithSession = req as unknown as RequestWithSession;

  // cache session

  requestWithSession.session.set("sessionID", session.id);
  await requestWithSession.session.save();

  return session;
}

export async function destroyAllSessions(
  req: Request,
  user: User
): Promise<void> {
  const requestWithSession = req as unknown as RequestWithSession;

  // @TODO: make it only delete all sessions if there are still "FULL" sessions.

  await prisma.$executeRaw(
    `DELETE FROM "Session" WHERE "userId" = '${user.id}'`
  );

  return requestWithSession.session.destroy();
}

export async function createAndDestroy(options: Options) {
  await destroyAllSessions(options.req, options.user!);
  return await createSession(options.req, options.user!, options.authType!);
}

export async function destroySession(
  req: Request,
  session: Session
): Promise<void> {
  const requestWithSession = req as unknown as RequestWithSession;

  requestWithSession.session.destroy();

  await prisma.session.delete({ where: { id: session?.id } });
}

export async function getSession(
  req: Request,
  res: Response
): Promise<Session | null> {
  await applySession(req, res, sessionOptions);

  let session: Session | null = null;

  const requestWithSession = req as unknown as RequestWithSession;
  const sessionID = requestWithSession.session.get("sessionID");

  if (sessionID) {
    session = await prisma.session.findFirst({
      where: {
        id: sessionID,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (session) {
      const shouldRefreshSession =
        differenceInSeconds(session.expiresAt as Date, new Date()) <
        0.75 * SESSION_TTL;

      if (shouldRefreshSession) {
        await prisma.session.update({
          where: {
            id: session.id,
          },
          data: {
            expiresAt: addSeconds(new Date(), SESSION_TTL),
          },
        });

        await requestWithSession.session.save();
      }
    }
  }

  return session;
}
