import { builder } from "../builder";

export const AccountInput = builder.inputType("AccountInput", {
  fields: (t) => ({
    firstName: t.string({
      required: false,
      validate: {
        minLength: 1,
        maxLength: 60,
      },
    }),

    lastName: t.string({
      required: false,
      validate: {
        minLength: 1,
        maxLength: 60,
      },
    }),

    email: t.string({
      required: false,
      validate: {
        email: true,
      },
    }),

    /*
    password: t.string({
      required: true,
      validate: {
        minLength: 9,
        maxLength: 150,
      },
    }),
    */
    //
    token: t.string({
      required: false,
    }),
  }),
});
