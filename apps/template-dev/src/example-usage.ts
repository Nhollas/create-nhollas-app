import express from "express"
import { z } from "zod"
import { createRouteHandler } from "./create-route"

const app = express()
app.use(express.json())

// Example 1: Basic route with no validation
app.get(
  "/hello",
  createRouteHandler().handle(async () => {
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
    .validateBody(createProductSchema)
    .handle(async ({ data }) => {
      // body is typed as z.infer<typeof createProductSchema>
      return {
        created: true,
        product: data,
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
    .validateBody(updateProductSchema)
    .validateQuery(productQuerySchema)
    .handle(async ({ data, query }) => {
      // body is typed as z.infer<typeof updateProductSchema>
      // query is typed as z.infer<typeof productQuerySchema>
      return {
        updated: true,
        productId: query.id,
        updates: data,
      }
    }),
)

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
