import { z } from "zod"

export const exampleSchema = z
  .object({
    id: z.string().uuid({ message: "Id must be a valid UUID." }),
    title: z
      .string()
      .min(1, { message: "Title cannot be empty." })
      .max(256, { message: "Title cannot be more than 256 characters." }),
    description: z
      .string()
      .min(1, { message: "Description cannot be empty." })
      .max(2048, {
        message: "Description cannot be more than 2048 characters.",
      }),
  })
  .strict()
