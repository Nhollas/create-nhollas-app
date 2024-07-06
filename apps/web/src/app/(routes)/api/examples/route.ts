import { exampleGenerator } from "@/test/data-generators"

export async function GET() {
  return Response.json(Array.from({ length: 8 }, exampleGenerator))
}
