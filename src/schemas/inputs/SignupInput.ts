import { builder } from "../builder";

export const SignupInput = builder.inputType("SignupInput", {
  fields: (t) => ({
    email: t.string({
      required: true,
      validate: {
        email: true,
      },
    }),
    password: t.string({
      required: true,
      validate: {
        minLength: 9,
      },
    }),
    name: t.string({ required: false }),
    refer: t.string({ required: false }),
    teamRefer: t.string({ required: false }),
  }),
});
