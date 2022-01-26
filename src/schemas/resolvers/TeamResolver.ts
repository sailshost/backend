import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { TeamInput } from "../inputs";
import { prisma } from "../prisma";

/*
builder.prismaObject("Team", {
  findUnique: (team) => ({ id: team.id }),
  fields: (t) => ({
    id: t.exposeID("id", {}),
    membership: t.relation("members", {
      resolve: (query, members) =>
        prisma.membership.findMany({
          ...query,
          where: { teamId: members.id },
        }),
    }),
  }),
});

builder.prismaObject("Team", {
  findUnique: (team) => ({ id: team.id }),
  fields: (t) => ({
    id: t.exposeID("id", {}),
  }),
});
*/

builder.mutationField("createTeam", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: TeamInput }),
    },
    resolve: async (query, _root, { input }, { session }) => {
      const user = await prisma.user.findUnique({
        ...query,
        where: { id: session?.userId },
      });

      if (!user) throw new AuthenticationError("invalid_user");

      const existingTeam = await prisma.team.count({
        where: {
          OR: [{ name: input!.name }, { slug: input!.slug }],
        },
      });

      if (existingTeam > 0) throw new Error("team_name_taken");

      const team = await prisma.team.create({
        data: {
          name: input!.name,
          slug: input!.slug,
          logo: input?.logo || "",
        },
      });

      await prisma.membership.create({
        data: {
          teamId: team.id,
          userId: session!.userId,
          role: "OWNER",
          accepted: true,
        },
      });

      return user;
    },
  })
);

builder.mutationField("editTeam", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: TeamInput }),
    },
    // @ts-ignore
    resolve: async (query, _root, { input }, { session }) => {
      const teamOwner = !!(await prisma.membership.findFirst({
        where: {
          userId: session!.userId,
          teamId: input!.id as string,
          role: "OWNER",
        },
      }));

      if (!teamOwner) throw new Error("insufficent_permissions");
    },
  })
);

builder.mutationField("teamInvite", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: TeamInput }),
    },
    resolve: async (_query, _root, { input }, { session }) => {
      enum Roles {
        OWNER = "OWNER",
        MEMBER = "MEMBER",
      }

      const team = await prisma.team.findUnique({
        where: {
          id: input!.id!,
        },
      });

      if (!team) throw new Error("invalid_team");

      const user = await prisma.user.findUnique({
        where: {
          email: input!.email!,
        },
      });

      if (!user) throw new Error("invalid_user");

      // send email saying that the user has been invited to a team.

      try {
        await prisma.membership.create({
          data: {
            teamId: input!.id!,
            userId: user.id,
            role: input!.role! as Roles,
          },
        });
        return user;
      } catch (err: any) {
        if (err.code === "P2002") {
          throw new Error("invite_pending_or_in_team");
        } else {
          throw err;
        }
      }
    },
  })
);

builder.mutationField("cancelTeamInvite", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    nullable: true,
    args: {
      input: t.arg({ type: TeamInput }),
    },
    // @ts-ignore
    resolve: async (_query, _root, { input }, { session }) => {
      const membership = await prisma.membership.findFirst({
        where: {
          userId: input!.userId as string,
          teamId: input!.id!,
        },
      });

      if(!membership) throw new Error("no_team_found");

      await prisma.membership.delete({
        where: {
          userId_teamId: { userId: input!.userId as string, teamId: input!.id! },
        },
      });

      return session!.userId;
    },
  })
);

builder.mutationField("deleteTeam", (t) =>
  t.prismaField({
    type: "User",
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: TeamInput }),
    },
    // @ts-ignore
    resolve: async (_query, _root, { input }, { session }) => {
      const membership = await prisma.membership.findFirst({
        where: {
          userId: session!.userId,
          teamId: input!.id!,
        },
      });

      if (!membership || membership.role !== "OWNER") {
        throw new Error("not_team_owner");
      }

      await prisma.membership.delete({
        where: {
          userId_teamId: { userId: session!.userId, teamId: input!.id! },
        },
      });

      await prisma.team.delete({
        where: {
          id: input!.id!,
        },
      });

      return membership;
    },
  })
);
