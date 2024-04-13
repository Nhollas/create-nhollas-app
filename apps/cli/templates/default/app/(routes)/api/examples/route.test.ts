import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("/examples API route", () => {
  it("should return some examples", async () => {
    const res = await GET()

    expect(res.status).toBe(200)

    const json = await res.json()

    expect(json).toHaveLength(8)
  })
})
