import { builder } from "../builder";

export const LogoutInput = builder.inputType("LogoutInput", {
  fields: (t) => ({
    logout: t.string(),
  }),
});
