import { z } from "zod"
import { withValidation } from "@/app/lib/api/with-validation"
import { NextResponse } from "next/server"

const createUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().positive().optional(),
})

export type CreateUserResponse = {
  id: string
  email: string
  name: string
  age?: number
  createdAt: string
}

async function createUserHandler(
  _: Request,
  validatedBody: z.infer<typeof createUserSchema>,
) {
  const user = await Promise.resolve({
    id: crypto.randomUUID(),
    ...validatedBody,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json(user, { status: 201 })
}

export const POST = withValidation(createUserHandler, createUserSchema)
