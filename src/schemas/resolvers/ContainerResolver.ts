import { AuthenticationError, ValidationError } from "apollo-server";
import { builder } from "../builder";
import { prisma } from "../prisma";

import axios from "axios";
import { ContainerInput } from "../inputs";

builder.prismaObject("Container", {
  findUnique: (container) => ({ id: container.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    userId: t.exposeString("userId", { nullable: false }),
    origin: t.exposeString("origin", { nullable: false }),
    uuid: t.exposeString("uuid", { nullable: false }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

builder.queryField("container", (t) =>
  t.prismaField({
    type: "Container",
    nullable: true,
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    resolve: async (query, _root, _args, { session }) => {
      const response = await axios.post(
        "http://localhost:42069/v1/containers/new",
        {}
      );

      const container = await prisma.container.create({
        ...query,
        data: {
          origin: response.data.origin as string,
          uuid: response.data.uuid as string,
          userId: session!.userId,
        },
      });

      return container;
    },
  })
);

builder.queryField("resolveContainer", (t) =>
  t.prismaField({
    type: "Container",
    nullable: true,
    skipTypeScopes: true,
    authScopes: {
      user: true,
      $granted: "currentUser",
    },
    args: {
      input: t.arg({ type: ContainerInput }),
    },
    resolve: async (query, _root, { input }, { session }) => {
      const container = await prisma.container.findUnique({
        ...query,
        where: { origin: input!.origin },
      });

      return container;
    },
  })
);
