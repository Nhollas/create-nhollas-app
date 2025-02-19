"use client"

import FrontendTracer from "src/instrumentation.browser"
import clientEnv from "@/app/lib/env/client"

export default function FrontendTracerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (
    typeof window !== "undefined" &&
    clientEnv.NEXT_PUBLIC_OTEL_COLLECTOR_URL !== "disabled"
  ) {
    FrontendTracer()
  }

  return children
}
