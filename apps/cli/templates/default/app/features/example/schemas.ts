import { z } from "zod"

export const exampleSchema = z
  .object({
    id: z.string().uuid({ message: "Id must be a valid UUID." }),
    title: z.string().min(1, { message: "Title cannot be empty." }),
    description: z.string().min(1, { message: "Description cannot be empty." }),
  })
  .strict()
