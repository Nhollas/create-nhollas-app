"use client"
import { CopyPlus, RotateCw } from "lucide-react"
import { useEffect, useState } from "react"

import { AnimatedButton } from "@/app/components/ui"

import { useDuplicateExampleMutation } from "../hooks"
import { Example } from "../types"

export const DuplicateExampleButton = ({ example }: { example: Example }) => {
  const [newExampleId, setNewExampleId] = useState<string | undefined>(
    undefined,
  )
  const { mutate, isPending } = useDuplicateExampleMutation(
    (duplicatedExample) => setNewExampleId(duplicatedExample.id),
  )

  useEffect(() => {
    if (newExampleId) {
      scrollToExample(newExampleId)
    }
  }, [newExampleId])

  return (
    <AnimatedButton
      layout
      variant="outline"
      type="button"
      disabled={isPending}
      className="aspect-square h-10"
      onClick={() => mutate(example)}
    >
      {isPending ? (
        <RotateCw className="h-5 w-5 flex-shrink-0 animate-spin" />
      ) : (
        <>
          <CopyPlus className="h-5 w-5 flex-shrink-0" />
          <span className="sr-only">Duplicate</span>
        </>
      )}
    </AnimatedButton>
  )
}

function scrollToExample(exampleId: string) {
  const element = document.getElementById(exampleId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}
