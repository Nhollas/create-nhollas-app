"use client"
import { AnimatePresenceWrapper } from "@/app/components"

import { useExamplesQuery } from "../hooks"
import { Example } from "../types"

import { AnimatedExampleCard } from "./AnimatedExampleCard"
import { ExampleCardBody } from "./ExampleCard"
import { ManageExampleContainer } from "./ManageExampleContainer"

export const ExampleCards = ({
  examples: initExamples,
}: {
  examples: Example[]
}) => {
  const { data: examples } = useExamplesQuery(initExamples)
  return (
    <AnimatePresenceWrapper mode="popLayout">
      {examples.map((example) => (
        <AnimatedExampleCard
          layout
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: "spring",
            duration: 0.15,
            layout: { duration: 0.25 },
          }}
          key={example.id}
          example={example}
        >
          <ManageExampleContainer example={example}>
            <ExampleCardBody example={example} />
          </ManageExampleContainer>
        </AnimatedExampleCard>
      ))}
    </AnimatePresenceWrapper>
  )
}
