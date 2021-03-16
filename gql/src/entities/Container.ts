import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from ".";

@ObjectType()
@Entity()
export class Container {
  @Field()
  @PrimaryKey()
  id: string;

  @Field()
  @Property({ type: "text" })
  origin: string;

  @Field()
  @Property({ type: "text" })
  name: string;

  @Field()
  @ManyToOne()
  user?: User;

  // @Field()
  // @Property({ type: "text" })
  // ownerID?: string;
}