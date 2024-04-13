import { clerkHandlers } from "./clerk"
import { exampleHandlers } from "./example"
import { tracingHandlers } from "./tracing"

export const handlers = [
  ...exampleHandlers,
  ...tracingHandlers,
  ...clerkHandlers,
]
