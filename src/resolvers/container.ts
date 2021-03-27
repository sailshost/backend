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
import { User } from "../entities/User";
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
  async createContainer(
    @Arg("options") options: ContainerInput,
    @Ctx() ctx: MyCtx
  ): Promise<Response> {
    let container;

    try {
      let userFetched = await ctx.em.findOne(User, {
        id: ctx.req.session.userId,
      });

      container = ctx.em.getRepository(Container).create({
        id: v4(),
        owner: userFetched,
        origin: random({ number: true }).dashed,
        name: options.name,
      });

      // create docker container & auto deploy
    } catch (err) {
      return {
        errors: [
          {
            field: "Container",
            message: `Unable to create container - ${err.stack}`,
          },
        ],
      };
    }

    await ctx.em.persistAndFlush(container);
    return { container };
  }

  @Query(() => Response)
  async getContainer(
    @Arg("origin") origin: string,
    @Ctx() ctx: MyCtx
  ): Promise<Response> {
    let container;
    try {
      container = await ctx.em.getRepository(Container).findOne({ origin });
    } catch (err) {
      return {
        errors: [
          {
            field: "Container",
            message: `Unable to find that container - ${err.stack}`,
          },
        ],
      };
    }

    return { container };
  }
}
