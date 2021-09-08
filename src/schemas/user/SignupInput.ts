import { builder } from "../builder";

export const SignupInput = builder.inputType("SignupInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    name: t.string({ required: false }),
    refer: t.string({ required: false }),
  }),
});
