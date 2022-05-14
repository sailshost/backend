import { builder } from "../builder";

export const PasswordInput = builder.inputType("PasswordInput", {
  fields: (t) => ({
    token: t.string({ required: true }),
    currentPassword: t.string({
      required: true,
      validate: {
        minLength: 9,
      },
    }),
    newPassword: t.string({
      required: true,
      validate: {
        minLength: 9,
      },
    }),
  })
})

export const PasswordRequestInput = builder.inputType("PasswordRequestInput", {
  fields: (t) => ({
    email: t.string({
      required: true,
      validate: {
        email: true,
      },
    }),
  })
})
