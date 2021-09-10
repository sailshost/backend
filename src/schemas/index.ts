import { builder } from "./builder";
import path from "path";
import fs from "fs";
import { printSchema, lexicographicSortSchema } from "graphql";
import "./resolvers";

const schema = builder.toSchema({});
const schemaAsString = printSchema(lexicographicSortSchema(schema));

fs.writeFileSync(path.join(process.cwd(), "schema.gql"), schemaAsString);

export default schema;
