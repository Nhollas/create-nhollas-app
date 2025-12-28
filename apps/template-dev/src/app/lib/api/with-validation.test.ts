import { z } from "zod"

import { withValidation } from "./with-validation"
import modelFactory from "@/test/model-factory"

const schema = z.object({
  name: z.string(),
})

const mockFn = vi.fn()

beforeEach(() => {
  mockFn.mockClear()
})

describe("When Request Body is Valid", () => {
  const requestBody = { name: "123" }
  const validRequest = modelFactory.request({
    json: () => Promise.resolve(requestBody),
  })
  beforeEach(async () => {
    const validatedFn = withValidation(mockFn, schema)

    await validatedFn(validRequest)
  })
  it("should call the callback function", () => {
    expect(mockFn).toHaveBeenCalledWith(validRequest, requestBody)
  })
})

describe("When Request Body is Invalid", () => {
  let response: Response

  beforeEach(async () => {
    const invalidRequest = modelFactory.request({
      json: () => Promise.resolve({ name: 123 }),
    })

    const validatedFn = withValidation(mockFn, schema)

    response = await validatedFn(invalidRequest)
  })

  it("should return a 422 status code", () => {
    expect(response?.status).toBe(422)
  })

  it("should return the validation errors", async () => {
    const expectedResponse = [
      {
        code: "invalid_type",
        expected: "string",
        message: "Invalid input: expected string, received number",
        path: ["name"],
      },
    ]
    expect(await response?.json()).toStrictEqual(expectedResponse)
  })

  it("should not call the callback function", () => {
    expect(mockFn).not.toHaveBeenCalled()
  })
})

describe("When an Unexpected Error Occurs", () => {
  let response: Response

  beforeEach(async () => {
    const errorRequest = modelFactory.request({
      json: () => {
        throw new Error("Unexpected error")
      },
    })

    const validatedFn = withValidation(mockFn, schema)
    response = await validatedFn(errorRequest)
  })

  it("should return a 500 status code", () => {
    expect(response?.status).toBe(500)
  })

  it("should return an error message", async () => {
    expect(await response?.text()).toBe("Unexpected Validation Error")
  })
})
