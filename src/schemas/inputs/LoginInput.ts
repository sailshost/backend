import { builder } from "../builder";

export const LoginInput = builder.inputType("LoginInput", {
  fields: (t) => ({
    email: t.string({ 
      required: true,
      validate: {
        email: true
      }
     }),
    password: t.string({ 
      required: true,
      validate: {
        minLength: 9,
        maxLength: 150
      }
     }),
  }),
});
