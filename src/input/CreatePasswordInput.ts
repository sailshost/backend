import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePasswordInput {
  @Field() token: string
  @Field() password: string
  @Field() confirmPassword: string
}