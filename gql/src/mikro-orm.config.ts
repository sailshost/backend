import { MikroORM } from "@mikro-orm/core";

import { Container, User } from "./entities";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
  entities: [User, Container],
  clientUrl: "postgresql://postgres:sails@localhost/sailsdev",
} as Parameters<typeof MikroORM.init>[0];
