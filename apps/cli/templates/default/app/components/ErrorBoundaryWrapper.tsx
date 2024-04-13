"use client"

import { ErrorBoundaryProps, ErrorBoundary } from "react-error-boundary"

type Props = ErrorBoundaryProps & {
  children: React.ReactNode
}

export const ErrorBoundaryWrapper = ({ children, ...props }: Props) => (
  <ErrorBoundary
    {...props}
    onError={(err) => console.log("Error caught:", err.message)}
  >
    {children}
  </ErrorBoundary>
)
