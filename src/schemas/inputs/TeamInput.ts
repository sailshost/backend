import { builder } from "../builder";

export const TeamInput = builder.inputType("TeamInput", {
  fields: (t) => ({
    id: t.string({ required: false }),
    userId: t.string({ required: false }),
    role: t.string({ required: false }),
    email: t.string({
      required: false,
      validate: {
        email: true,
      },
    }),
    name: t.string({
      required: false,
      validate: {
        minLength: 3,
        maxLength: 100,
      },
    }),
    slug: t.string({
      required: false,
      validate: {
        minLength: 3,
        maxLength: 40,
      },
    }),
    logo: t.string({ required: false }),
  }),
});
