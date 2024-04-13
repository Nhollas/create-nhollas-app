import { Suspense } from "react"

import { ErrorBoundaryWrapper } from "@/app/components"
import { renderPromise } from "@/app/lib/utils"
import ExampleService from "@/app/services/Example.service"

import { Example } from "../types"

import { ExampleCardSkeleton } from "./ExampleCard"
import { ExampleCardError } from "./ExampleCardError"

export const ExamplesContainer = ({
  render,
}: {
  render: (examples: Example[]) => JSX.Element
}) => {
  const RenderPromise = () => renderPromise(render, ExampleService.getExamples)

  return (
    <ErrorBoundaryWrapper fallback={<ExampleCardError />}>
      <Suspense
        fallback={Array.from({ length: 6 }, (_, i) => (
          <ExampleCardSkeleton key={i} />
        ))}
      >
        <RenderPromise />
      </Suspense>
    </ErrorBoundaryWrapper>
  )
}
