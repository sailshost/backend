import {
  Arg,
  Query,
  Resolver,
  Ctx,
  Mutation,
  Field,
  ObjectType,
  UseMiddleware,
} from "type-graphql";
import { v4 } from "uuid";
import { MyCtx } from "../types";
import { IS_PROD } from "../constants";
import { Container } from "../entities";
import { isAuthed } from "../middleware/isAuthed";
import { ContainerInput } from "../input/ContainerInput";
import { FieldError } from "../entities/FieldError";
import random from "project-name-generator";
// MAKE YOUR OWN LIBRARY TO GEN RANDOM NAMES FOR PROJECTSSSSSSSSSSSSSSSSSSSSSSSSSSS

@ObjectType()
class Response {
  @Field(() => [FieldError], { nullable: true }) errors?: FieldError[];
  @Field(() => Container, { nullable: true }) container?: Container;
}

@Resolver()
export class ContainerResolver {
  @Mutation(() => Response)
  @UseMiddleware(isAuthed)
  async createContainer (
    @Arg("options") options: ContainerInput,
    @Ctx() ctx: MyCtx
  ): Promise<Response> {
    let container;
    try {
      container = ctx.em.create(Container, {
        id: v4(),
        origin: random({ number: true }).dashed, 
        name: options.name,
        ownerID: ctx.req.session.userId
      });
    } catch(err) {
      return {
        errors: [
          {
            field: "Container",
            message: `Unable to create container - ${err.stack}`
          }
        ]
      }
    }

    ctx.em.persistAndFlush(container);

    return { container };
  }

  @Query(() => Response)
  async getContainer(
    @Arg("origin") origin: string,
    @Ctx() ctx: MyCtx
  ): Promise<Response> {
    let container;
    try {
      container = await ctx.em.findOne(Container, { origin })
    } catch(err) {
      return {
        errors: [
          {
            field: "Container",
            message: `Unable to find that container - ${err.stack}`
          }
        ]
      }
    }

    return { container };
  }
}