import express from "express"
import { z } from "zod"
import { createRouteHandler } from "./create-route"

const app = express()
app.use(express.json())

// Example 1: Basic route with no validation
app.get(
  "/hello",
  createRouteHandler().handler(async () => {
    return { message: "Hello world!" }
  }),
)

// Example 2: Route with body validation using Zod
const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
})

app.post(
  "/products",
  createRouteHandler()
    .validator((data: unknown) => {
      return createProductSchema.parse(data)
    })
    .validateQuery((query: unknown) => query)
    .handler(async ({ body }) => {
      return {
        created: true,
        product: body,
      }
    }),
)

// Example 3: Route with both body and query validation
const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
})

const productQuerySchema = z.object({
  id: z.string(),
})

app.put(
  "/products",
  createRouteHandler()
    .validator((data: unknown) => updateProductSchema.parse(data))
    .validateQuery((query: unknown) => productQuerySchema.parse(query))
    .handler(async ({ body, query }) => {
      // body is typed as z.infer<typeof updateProductSchema>
      // query is typed as z.infer<typeof productQuerySchema>
      return {
        updated: true,
        productId: query.id,
        updates: body,
      }
    }),
)

// Example 4: Using with route parameters
app.get(
  "/products/:id",
  createRouteHandler()
    .validateQuery((query: unknown) =>
      z.object({ format: z.string().optional() }).parse(query),
    )
    .handler(async ({ req, query }) => {
      const productId = req.params.id
      const format = query.format || "json"

      return {
        id: productId,
        format,
        name: "Sample Product",
      }
    }),
)

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
