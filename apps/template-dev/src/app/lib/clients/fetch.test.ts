import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchWrapper } from "./fetch"

describe("fetchWrapper", () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockResolvedValue(new Response())
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.clearAllMocks()
  })

  describe("baseUrl", () => {
    it("should prepend baseUrl to the provided url", async () => {
      const client = fetchWrapper({ baseUrl: "https://api.example.com" })

      await client("/users")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        {},
      )
    })

    it("should work with baseUrl without trailing slash", async () => {
      const client = fetchWrapper({ baseUrl: "https://api.example.com" })

      await client("/endpoint")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        {},
      )
    })

    it("should work with baseUrl with trailing slash", async () => {
      const client = fetchWrapper({ baseUrl: "https://api.example.com/" })

      await client("endpoint")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        {},
      )
    })
  })

  describe("defaultConfig", () => {
    it("should use defaultConfig when no config is provided", async () => {
      const defaultConfig: RequestInit = {
        headers: { Authorization: "Bearer token" },
        method: "GET",
      }
      const client = fetchWrapper({
        baseUrl: "https://api.example.com",
        defaultConfig,
      })

      await client("/users")

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
        headers: { Authorization: "Bearer token" },
        method: "GET",
      })
    })

    it("should work without defaultConfig", async () => {
      const client = fetchWrapper({ baseUrl: "https://api.example.com" })

      await client("/users")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        {},
      )
    })
  })

  describe("config override", () => {
    it("should override defaultConfig with provided config", async () => {
      const defaultConfig: RequestInit = {
        headers: { Authorization: "Bearer token" },
        method: "GET",
      }
      const client = fetchWrapper({
        baseUrl: "https://api.example.com",
        defaultConfig,
      })

      await client("/users", { method: "POST" })

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
        headers: { Authorization: "Bearer token" },
        method: "POST",
      })
    })

    it("should merge headers from defaultConfig and config", async () => {
      const defaultConfig: RequestInit = {
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
      }
      const client = fetchWrapper({
        baseUrl: "https://api.example.com",
        defaultConfig,
      })

      await client("/users", {
        headers: { "Content-Type": "text/plain", "X-Custom": "value" },
      })

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "text/plain",
          "X-Custom": "value",
        },
      })
    })

    it("should allow overriding all defaultConfig properties", async () => {
      const defaultConfig: RequestInit = {
        headers: { Authorization: "Bearer token" },
        method: "GET",
        mode: "cors",
      }
      const client = fetchWrapper({
        baseUrl: "https://api.example.com",
        defaultConfig,
      })

      const overrideConfig: RequestInit = {
        headers: { "X-Custom": "custom" },
        method: "DELETE",
        mode: "no-cors",
      }

      await client("/users", overrideConfig)

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
        headers: { Authorization: "Bearer token", "X-Custom": "custom" },
        method: "DELETE",
        mode: "no-cors",
      })
    })

    it("should preserve config when defaultConfig is not provided", async () => {
      const client = fetchWrapper({ baseUrl: "https://api.example.com" })

      await client("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    })
  })

  describe("return value", () => {
    it("should return the response from fetch", async () => {
      const mockResponse = new Response('{"data":"test"}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
      mockFetch.mockResolvedValue(mockResponse)

      const client = fetchWrapper({ baseUrl: "https://api.example.com" })
      const response = await client("/users")

      expect(response).toBe(mockResponse)
    })

    it("should propagate fetch errors", async () => {
      const error = new Error("Network error")
      mockFetch.mockRejectedValue(error)

      const client = fetchWrapper({ baseUrl: "https://api.example.com" })

      await expect(client("/users")).rejects.toThrow("Network error")
    })
  })
})
