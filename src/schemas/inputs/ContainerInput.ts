import { builder } from "../builder";

export const ContainerInput = builder.inputType("ContainerInput", {
  fields: (t) => ({
    origin: t.string({ required: true })
  })
})