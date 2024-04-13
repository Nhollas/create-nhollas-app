import { notFound } from "next/navigation"

import { Paragraph } from "@/app/components/ui"
import { env } from "@/app/lib/env"

export default async function Playground({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { DRAFTMODE_SECRET } = env

  const urlSearchParams = new URLSearchParams(searchParams)

  if (urlSearchParams.get("secret") !== DRAFTMODE_SECRET) {
    return notFound()
  }
  return (
    <section className="w-full space-y-8">
      <Paragraph>Welcome To The Playground.</Paragraph>
    </section>
  )
}
