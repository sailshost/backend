import {
  ArrayType,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", default: "''" })
  @Unique()
  email?: string;

  @Field()
  @Property({ type: "text", default: "''" })
  name?: string;

  @Field()
  @Property({ type: "text", default: "''" })
  code?: string;

  @Field()
  @Property({ type: "text", default: "''" })
  token?: string;

  @Property({ type: "text", nullable: true })
  password?: string;

  // @Field()
  // @Property({ type: ArrayType })
  // sites: string[];
}
