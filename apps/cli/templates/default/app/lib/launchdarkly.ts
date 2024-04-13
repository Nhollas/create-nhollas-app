import * as LaunchDarkly from "@launchdarkly/node-server-sdk"
import { LDClient } from "@launchdarkly/node-server-sdk"
import { trace, SpanStatusCode, Span } from "@opentelemetry/api"
import { headers } from "next/headers"

import { env } from "./env"

const { LAUNCHDARKLY_SDK_KEY, FLAG_SECRET } = env
let launchDarklyClient: LDClient
async function initialize() {
  launchDarklyClient = LaunchDarkly.init(LAUNCHDARKLY_SDK_KEY)
  await launchDarklyClient.waitForInitialization()
}
export async function getClient() {
  if (launchDarklyClient) {
    await launchDarklyClient.waitForInitialization()
    return launchDarklyClient
  }
  await initialize()
  return launchDarklyClient
}

function getUserContext(span: Span): LaunchDarkly.LDContext {
  const headerList = headers()

  const contextKey = headerList.get("contextKey")

  function hasSecretAndContext(
    contextKey: string | null,
  ): contextKey is string {
    return headerList.get("flagSecret") === FLAG_SECRET && contextKey !== null
  }

  if (!hasSecretAndContext(contextKey)) {
    return {
      kind: "user",
      key: "anonymous",
      name: "Anonymous User",
    }
  }

  span.setAttributes({
    contextKey,
  })

  return {
    kind: "user",
    key: contextKey,
    name: contextKey.toUpperCase(),
  }
}

export async function getVariation<T>(
  flag: string,
  defaultValue: T,
): Promise<T> {
  return await trace
    .getTracer("launchdarkly")
    .startActiveSpan("getVariation", async (span) => {
      try {
        const client = await getClient()
        const context = getUserContext(span)

        const value = await client.variation(flag, context, defaultValue)

        span.setStatus({ code: SpanStatusCode.OK })
        span.setAttributes({
          flag,
          "flag.value": value,
          context: JSON.stringify(context),
        })

        return value
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "Unexpected error while getting variation",
        })
        span.recordException(new Error(String(error), { cause: error }))

        return defaultValue
      } finally {
        span.end()
      }
    })
}
