import { Request, Response, NextFunction } from "express"
import { z, ZodSchema } from "zod"

interface RouteHandler<Body, Query> {
  validateBody: <T extends ZodSchema>(
    schema: T,
  ) => RouteHandler<z.infer<T>, Query>
  validateQuery: <T extends ZodSchema>(
    schema: T,
  ) => RouteHandler<Body, z.infer<T>>
  handle: (
    handler: (data: {
      data: Body
      queryParams: Query
      res: Response
      req: Request
    }) => Promise<unknown> | unknown,
  ) => (req: Request, res: Response, next: NextFunction) => void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRouteHandler<Body = any, Query = any>(): RouteHandler<
  Body,
  Query
> {
  let bodySchema: ZodSchema<Body> | undefined
  let querySchema: ZodSchema<Query> | undefined

  const routeHandler: RouteHandler<Body, Query> = {
    validateBody: <T extends ZodSchema>(schema: T) => {
      bodySchema = schema
      return routeHandler as RouteHandler<z.infer<T>, Query>
    },
    validateQuery: <T extends ZodSchema>(schema: T) => {
      querySchema = schema
      return routeHandler as RouteHandler<Body, z.infer<T>>
    },
    handle: (
      callback: (payload: {
        data: Body
        queryParams: Query
        res: Response
        req: Request
      }) => Promise<unknown> | unknown,
    ) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          let validatedBody: Body | undefined
          let queryParams: Query | undefined

          if (bodySchema) {
            validatedBody = await bodySchema.parseAsync(req.body)
          }

          if (querySchema) {
            queryParams = await querySchema.parseAsync(req.query)
          }

          const result = await callback({
            data: validatedBody!,
            queryParams: queryParams!,
            res,
            req,
          })

          res.json(result)
        } catch (error) {
          if (error instanceof z.ZodError) {
            if (
              bodySchema &&
              error.issues.some(
                (issue) => issue.path.length > 0 && issue.path[0] !== "query",
              )
            ) {
              return res.status(422).json({ errors: error.errors })
            }

            if (
              querySchema &&
              error.issues.some(
                (issue) => issue.path.length > 0 && issue.path[0] === "query",
              )
            ) {
              return res.status(400).json({ errors: error.errors })
            }
            return res.status(400).json({ errors: error.errors })
          }
          next(error)
        }
      }
    },
  }

  return routeHandler
}
