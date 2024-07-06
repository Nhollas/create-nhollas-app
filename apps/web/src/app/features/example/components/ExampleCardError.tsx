"use client"
import { useRouter } from "next/navigation"

import { Button, Paragraph } from "@/app/components/ui"

export const ExampleCardError = () => {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-y-4">
      <Paragraph>We ran into issues getting your examples.</Paragraph>
      <Button onClick={() => router.refresh()}>Try again</Button>
    </div>
  )
}
