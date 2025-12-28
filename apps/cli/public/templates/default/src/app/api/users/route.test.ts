import { describe, it, expect } from "vitest"
import { POST, CreateUserResponse } from "./route"

describe("POST /api/users", () => {
  it("should create a user with valid data", async () => {
    const validData = {
      email: "test@example.com",
      name: "John Doe",
      age: 25,
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validData),
    })

    const response = await POST(request)
    const data = (await response.json()) as CreateUserResponse

    expect(response.status).toBe(201)
    expect(data).toMatchObject({
      email: validData.email,
      name: validData.name,
      age: validData.age,
    })
    expect(data.id).toBeDefined()
    expect(data.createdAt).toBeDefined()
  })

  it("should create a user without optional age field", async () => {
    const validData = {
      email: "test@example.com",
      name: "Jane Doe",
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validData),
    })

    const response = await POST(request)
    const data = (await response.json()) as CreateUserResponse

    expect(response.status).toBe(201)
    expect(data.age).toBeUndefined()
  })

  it("should return 422 with invalid email", async () => {
    const invalidData = {
      email: "not-an-email",
      name: "John Doe",
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const issues: unknown = await response.json()

    expect(response.status).toBe(422)
    expect(issues).toHaveLength(1)
    expect(issues).toEqual([
      {
        code: "invalid_format",
        format: "email",
        message: "Invalid email address",
        origin: "string",
        path: ["email"],
        pattern: expect.any(String),
      },
    ])
  })

  it("should return 422 with missing required fields", async () => {
    const invalidData = {
      email: "test@example.com",
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const issues: unknown = await response.json()

    expect(response.status).toBe(422)
    expect(issues).toEqual([
      {
        code: "invalid_type",
        expected: "string",
        message: "Invalid input: expected string, received undefined",
        path: ["name"],
      },
    ])
  })

  it("should return 422 with name too short", async () => {
    const invalidData = {
      email: "test@example.com",
      name: "J",
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const issues: unknown = await response.json()

    expect(response.status).toBe(422)
    expect(issues).toEqual([
      {
        code: "too_small",
        inclusive: true,
        message: "Name must be at least 2 characters",
        minimum: 2,
        origin: "string",
        path: ["name"],
      },
    ])
  })

  it("should return 422 with invalid age type", async () => {
    const invalidData = {
      email: "test@example.com",
      name: "John Doe",
      age: "twenty-five",
    }

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidData),
    })

    const response = await POST(request)
    const issues: unknown = await response.json()

    expect(response.status).toBe(422)
    expect(issues).toEqual([
      {
        code: "invalid_type",
        expected: "number",
        message: "Invalid input: expected number, received string",
        path: ["age"],
      },
    ])
  })
})
