import { MikroORM } from "@mikro-orm/core";

import { User } from "./entities";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
  entities: [User],
  clientUrl: "postgresql://postgres:sails@localhost/sails",
} as Parameters<typeof MikroORM.init>[0];
