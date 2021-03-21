import { Field, InputType } from "type-graphql";

@InputType()
export class SignupInput {
  @Field() email: string
  @Field() name: string
}