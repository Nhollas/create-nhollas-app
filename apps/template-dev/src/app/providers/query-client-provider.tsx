"use client"
import { QueryClientProvider as QCP, QueryClient } from "@tanstack/react-query"
import { PropsWithChildren } from "react"

const client = new QueryClient()

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return <QCP client={client}>{children}</QCP>
}
