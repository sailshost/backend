import { Context } from "../schemas/builder";
import { prisma } from "../schemas/prisma";
import { User } from "@prisma/client";

export async function createSession(
  user: User,
  id?: string,
  redisKey?: string
): Promise<void | unknown> {
  const session = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });
  return session;
}
