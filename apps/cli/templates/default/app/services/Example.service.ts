import { trace, SpanStatusCode } from "@opentelemetry/api"

import { Example } from "@/app/features/example"

import { env } from "../lib/env"

import ClientBuilder from "./ClientBuilder"

import { IClient, IService } from "."

const { EXAMPLE_SERVICE_URL } = env

interface IExampleClient extends IClient {}

const ExampleClient: IExampleClient = {
  instance: ClientBuilder.build({
    baseURL: EXAMPLE_SERVICE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  createUrl: ClientBuilder.baseUrl(EXAMPLE_SERVICE_URL),
}

interface IExampleService extends IService {
  getExamples(): Promise<Example[]>
}

const ExampleService = (): IExampleService => ({
  createUrl(path: string): string {
    return ExampleClient.createUrl(path)
  },
  async getExamples() {
    return await trace
      .getTracer("ExampleService")
      .startActiveSpan("getExamples", async (span) => {
        try {
          const response = await ExampleClient.instance.get("/examples")
          span.setStatus({ code: SpanStatusCode.OK })

          const examples = response.data

          return examples
        } catch (error: any) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: "Unexpected error while fetching examples.",
          })
          span.recordException(error)

          throw error
        } finally {
          span.end()
        }
      })
  },
})

export default ExampleService()
