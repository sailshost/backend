import { Field, InputType } from "type-graphql";

@InputType()
export class ContainerInput {
  @Field() name: string;
}
