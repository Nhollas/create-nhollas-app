import { Request, Response, NextFunction } from "express"
import { z, ZodSchema } from "zod"

interface RouteHandler<TData, TQuery> {
  validateBody: <T extends ZodSchema>(
    schema: T,
  ) => RouteHandler<z.infer<T>, TQuery>
  validateQuery: <T extends ZodSchema>(
    schema: T,
  ) => RouteHandler<TData, z.infer<T>>
  handle: (
    handler: (data: {
      data: TData
      query: TQuery
      res: Response
      req: Request
    }) => Promise<unknown> | unknown,
  ) => (req: Request, res: Response, next: NextFunction) => void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRouteHandler<TData = any, TQuery = any>(): RouteHandler<
  TData,
  TQuery
> {
  let bodySchema: ZodSchema<TData> | undefined
  let querySchema: ZodSchema<TQuery> | undefined

  const routeHandler: RouteHandler<TData, TQuery> = {
    validateBody: <T extends ZodSchema>(schema: T) => {
      bodySchema = schema
      return routeHandler as RouteHandler<z.infer<T>, TQuery>
    },
    validateQuery: <T extends ZodSchema>(schema: T) => {
      querySchema = schema
      return routeHandler as RouteHandler<TData, z.infer<T>>
    },
    handle: (
      callback: (payload: {
        data: TData
        query: TQuery
        res: Response
        req: Request
      }) => Promise<unknown> | unknown,
    ) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          let data: TData | undefined = undefined
          let query: TQuery | undefined = undefined

          if (bodySchema) {
            try {
              data = await bodySchema.parseAsync(req.body)
            } catch (error) {
              if (error instanceof z.ZodError) {
                return res.status(422).json({ errors: error.errors })
              }

              return next()
            }
          }

          if (querySchema) {
            try {
              query = await querySchema.parseAsync(req.query)
            } catch (error) {
              if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors })
              }

              return next()
            }
          }

          const result = await callback({
            data: data as TData,
            query: query as TQuery,
            res,
            req,
          })

          res.json(result)
        } catch (error) {
          next(error)
        }
      }
    },
  }

  return routeHandler
}
