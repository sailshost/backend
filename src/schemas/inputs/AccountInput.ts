import { builder } from "../builder";

export const AccountInput = builder.inputType("AccountInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      validate: {
        minLength: 1,
        maxLength: 60,
      },
    }),
  }),
});
