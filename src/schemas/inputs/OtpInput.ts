import { builder } from "../builder";

export const EnableTOTPInput = builder.inputType("EnableTOTPInput", {
  fields: (t) => ({
    secret: t.string({ required: true }),
    token: t.string({ required: true })
  })
})

export const DisableTOTPInput = builder.inputType("DisableTOTPInput", {
  fields: (t) => ({
    password: t.string({ required: true }),
  })
})
