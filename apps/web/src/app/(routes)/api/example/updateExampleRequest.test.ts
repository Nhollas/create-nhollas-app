vi.mock("@/app/lib/env.ts")

import { describe, it, expect, beforeEach, vi } from "vitest"

import { Example } from "@/app/features/example"
import { exampleGenerator } from "@/test/data-generators"
import modelFactory from "@/test/model-factory"

import { PUT } from "./route"

describe("When Request Body is Valid", () => {
  let response: Response
  const exampleToUpdate = exampleGenerator()

  beforeEach(async () => {
    const mockedRequest = modelFactory.request({
      json: async () => exampleToUpdate,
    })

    response = await PUT(mockedRequest)
  })

  it("should return 200OK", () => {
    expect(response.status).toBe(200)
  })

  it("should return the updated example", async () => {
    const example = (await response.json()) as Example

    expect(example).toStrictEqual(exampleToUpdate)
  })
})

describe("When Request Body is Invalid", () => {
  let response: Response

  beforeEach(async () => {
    const invalidRequest = modelFactory.request({
      json: async () => ({
        id: 123,
        description: "Description",
        title: "Title",
      }),
    })

    response = await PUT(invalidRequest)
  })

  it("should return a 422 status code", () => {
    expect(response.status).toBe(422)
  })

  it("should return the validation errors", async () => {
    const expectedResponse = [
      {
        code: "invalid_type",
        expected: "string",
        message: "Expected string, received number",
        path: ["id"],
        received: "number",
      },
    ]
    expect(await response.json()).toStrictEqual(expectedResponse)
  })
})
