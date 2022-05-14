import { builder } from "../builder"

export enum Result {
  OK = "OK",
  FAIL = "FAILED"
}

builder.enumType(Result, { name: "Result" })
