import { trace, SpanStatusCode } from "@opentelemetry/api"

import { Example, exampleSchema } from "@/app/features/example"
import { withValidation } from "@/app/lib/api"

export const PUT = withValidation(
  async (request, updatedExample) =>
    await updateExampleRequest(request, updatedExample),
  exampleSchema,
)

async function updateExampleRequest(request: Request, example: Example) {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("updateExampleRequest", async (span) => {
      try {
        span.setStatus({ code: SpanStatusCode.OK })

        return Response.json(example)
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "Unexpected error while updating example",
        })
        span.recordException(new Error(String(error), { cause: error }))

        return new Response("Unexpected Error", { status: 500 })
      } finally {
        span.end()
      }
    })
}

export function DELETE() {
  return new Response("Ok", {
    status: 200,
  })
}
