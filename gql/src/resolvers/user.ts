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
import { User } from "../entities/User";
import { SignupInput } from "../input/SignupInput";
import { MyCtx } from "../types";
import { v4 } from "uuid";
import { sendMail } from "@sails/shared";
import argon2 from "argon2";
import { isAuthed } from "../middleware/isAuthed";
import { CreatePasswordInput } from "../input/CreatePasswordInput";
import { IS_PROD } from "../constants";
import { FieldError } from "../entities/FieldError";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true }) errors?: FieldError[];
  @Field(() => User, { nullable: true }) user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuthed)
  async me(@Ctx() ctx: MyCtx): Promise<User> {
    if (!ctx.req.session.userId) {
      return null;
    }
    let user;
    try {
      user = await ctx.em.findOne(User, { id: ctx.req.session.userId });
    } catch (err) {}

    return user;
  }

  @Mutation(() => UserResponse)
  async signup(
    @Arg("options") options: SignupInput,
    @Ctx() ctx: MyCtx
  ): Promise<UserResponse> {
    let user;
    try {
      user = ctx.em.create(User, {
        id: v4(),
        email: options.email,
        name: options.name,
      });

      const token = v4();

      await ctx.redis.set(`password:${token}`, user.id, "ex", 86400000);

      user.token = token;

      const link = `${
        IS_PROD ? "https://sails.host" : "http://localhost:3000"
      }/password/${token}`;

      IS_PROD
        ? sendMail(user.email, "d-f38009cead11457cb4a1b57b30c2312c", {
            subject: "Email verification",
            link: link,
            name: user.name,
          })
        : console.log(link);
    } catch (err) {
      // if (err.code === "23505") {
      return {
        errors: [
          {
            field: "unknown",
            message: `Something went wrong - ${err.stack}`,
          },
        ],
      };
      // }
    }

    ctx.em.persistAndFlush(user);

    return { user };
  }

  // @UseMiddleware(isAuthed)
  @Mutation(() => UserResponse)
  async createPassword(
    @Arg("options") options: CreatePasswordInput,
    @Ctx() ctx: MyCtx
  ): Promise<UserResponse> {
    if (options.password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must exceed 6 characters",
          },
        ],
      };
    }

    if (options.confirmPassword !== options.password) {
      return {
        errors: [
          {
            field: "password",
            message: "Confirm password does not match password",
          },
        ],
      };
    }

    const key = `password:${options.token}`;
    const redisToken = await ctx.redis.get(key);

    if (!redisToken) {
      return {
        errors: [
          {
            field: "token",
            message: "Token has expired.",
          },
        ],
      };
    }

    const user = await ctx.em.findOne(User, { token: options.token });

    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "Unable to find that user",
          },
        ],
      };
    }

    user.password = await argon2.hash(options.password);

    await ctx.em.persistAndFlush(user);

    await ctx.redis.del(key);

    ctx.req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async resendEmail(
    @Arg("email") email: string,
    @Ctx() ctx: MyCtx
  ): Promise<UserResponse> {
    const user = await ctx.em.findOne(User, { email });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Unable to find that email",
          },
        ],
      };
    }

    try {
      if (user.emailCompleted) {
        return {
          errors: [
            {
              field: "email",
              message: "Your email is already verified",
            },
          ],
        };
      }

      const token = v4();

      user.token = token;

      await ctx.redis.set(`password:${token}`, user.id, "ex", 86400000);

      ctx.em.persistAndFlush(user);

      const link = `${
        IS_PROD ? "https://sails.host" : "http://localhost:3000"
      }/password/${token}`;

      IS_PROD
        ? sendMail(user.email, "d-f38009cead11457cb4a1b57b30c2312c", {
            subject: "Email verification",
            link: link,
            name: user.name,
          })
        : console.log(link);
    } catch (err) {
      return {
        errors: [
          {
            field: "unknown",
            message: `Something went wrong - ${err.stack}`,
          },
        ],
      };
    }

    ctx.req.session.userId = user.id;

    return { user };
  }
}
