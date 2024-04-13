import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button, Heading } from "@/app/components/ui"
import {
  ExamplesContainer,
  ExamplesGrid,
  ExampleCards,
} from "@/app/features/example"

export default function ExamplesPage() {
  return (
    <section className="w-full space-y-8">
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/" className="flex flex-row items-start gap-x-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      <Heading className="text-2xl font-medium">Examples Page</Heading>
      <ExamplesGrid>
        <ExamplesContainer
          render={(examples) => <ExampleCards examples={examples} />}
        />
      </ExamplesGrid>
    </section>
  )
}
