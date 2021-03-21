import {
  Entity,
  OneToMany,
  OneToOne,
  Cascade,
  PrimaryKey,
  Property,
  ManyToOne,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from ".";

@ObjectType()
@Entity()
export class Container {
  @Field()
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  owner!: User;

  @Field({ nullable: true })
  @Property({ type: "text" })
  origin: string;

  @Property({ type: "text" })
  name: string;
}
