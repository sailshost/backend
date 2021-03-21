import {
  ArrayType,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Container } from "./Container";

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

  @Field()
  @Property({ type: "text", nullable: true })
  password?: string;

  @Property({ type: "text", nullable: true })
  emailCompleted?: boolean;

  @Field(() => [Container])
  @OneToMany(() => Container, (con: Container) => con.owner, {
    cascade: [Cascade.ALL],
  })
  containers = new Collection<Container>(this);
}
