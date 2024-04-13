import { faker } from "@faker-js/faker"
import { trace, SpanStatusCode } from "@opentelemetry/api"

import { Example, exampleSchema } from "@/app/features/example"
import { withValidation } from "@/app/lib/api"
import { exampleGenerator } from "@/test/data-generators"

export const POST = withValidation(
  async (request, exampleToDuplicate) =>
    await duplicateExampleRequest(request, exampleToDuplicate),
  exampleSchema,
)

async function duplicateExampleRequest(
  request: Request,
  exampleToDuplicate: Example,
) {
  return await trace
    .getTracer("example-app")
    .startActiveSpan("duplicateExampleRequest", async (span) => {
      try {
        span.setStatus({ code: SpanStatusCode.OK })

        return Response.json(
          exampleGenerator({
            ...exampleToDuplicate,
            id: faker.string.uuid(),
          }),
        )
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "Unexpected error while duplicating example",
        })
        span.recordException(new Error(String(error), { cause: error }))

        return new Response("Unexpected Error", { status: 500 })
      } finally {
        span.end()
      }
    })
}
