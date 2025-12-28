import { z } from "zod"

export function withValidation<T extends z.ZodTypeAny>(
  callBack: (request: Request, validatedBody: z.infer<T>) => Promise<Response>,
  schema: T,
) {
  return async (request: Request) => {
    try {
      const body: unknown = await request.clone().json()

      const validatedBody = await schema.parseAsync(body)

      return callBack(request, validatedBody)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(error.issues, { status: 422 })
      }

      return new Response("Unexpected Validation Error", { status: 500 })
    }
  }
}
