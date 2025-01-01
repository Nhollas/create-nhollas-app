"use client"

import FrontendTracer from "@/instrumentation.browser"

export default function FrontendTracerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_OTEL_COLLECTOR_URL !== "disabled"
  ) {
    FrontendTracer()
  }

  return children
}
