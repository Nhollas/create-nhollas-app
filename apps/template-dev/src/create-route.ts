import { RequestHandler, Request, Response } from "express"

type AnyFunction = (...args: any[]) => any
type InferValidator<T extends AnyFunction> = T extends (data: any) => infer R
  ? R
  : never

export function createRouteHandler() {
  type BodyValidator = undefined
  type QueryValidator = undefined

  const builder = {
    validator<TValidator extends (data: any) => any>(validatorFn: TValidator) {
      type NewBodyValidator = InferValidator<TValidator>
      return createChain<NewBodyValidator, QueryValidator>(validatorFn)
    },

    validateQuery<TValidator extends (data: any) => any>(
      validatorFn: TValidator,
    ) {
      type NewQueryValidator = InferValidator<TValidator>
      return createChain<BodyValidator, NewQueryValidator>(
        undefined,
        validatorFn,
      )
    },

    handler<TRes = any>(
      handler: (params: {
        req: Request
        res: Response
        body: BodyValidator
        query: QueryValidator
      }) => Promise<TRes> | TRes,
    ): RequestHandler {
      return async (req, res, next) => {
        try {
          let validatedBody: any = req.body
          let validatedQuery: any = req.query

          const result = await handler({
            req,
            res,
            body: validatedBody,
            query: validatedQuery,
          })

          if (!res.headersSent) {
            res.json(result)
          }
        } catch (error) {
          next(error)
        }
      }
    },
  }

  return builder

  function createChain<TBodyValidator = unknown, TQueryValidator = unknown>(
    bodyValidatorFn?: AnyFunction,
    queryValidatorFn?: AnyFunction,
  ) {
    return {
      validator<TValidator extends (data: any) => any>(
        validatorFn: TValidator,
      ) {
        type NewBodyValidator = InferValidator<TValidator>
        return createChain<NewBodyValidator, TQueryValidator>(
          validatorFn,
          queryValidatorFn,
        )
      },

      validateQuery<TValidator extends (data: any) => any>(
        validatorFn: TValidator,
      ) {
        type NewQueryValidator = InferValidator<TValidator>
        return createChain<TBodyValidator, NewQueryValidator>(
          bodyValidatorFn,
          validatorFn,
        )
      },

      handler<TRes = any>(
        handler: (params: {
          req: Request
          res: Response
          body: TBodyValidator
          query: TQueryValidator
        }) => Promise<TRes> | TRes,
      ): RequestHandler {
        return async (req, res, next) => {
          try {
            // Validate body if validator was provided
            let validatedBody: any = undefined
            if (req.body && bodyValidatorFn) {
              try {
                validatedBody = bodyValidatorFn(req.body)
              } catch (error) {
                return next(error)
              }
            } else if (req.body) {
              validatedBody = req.body
            }

            // Validate query if validator was provided
            let validatedQuery: any = undefined
            if (req.query && queryValidatorFn) {
              try {
                validatedQuery = queryValidatorFn(req.query)
              } catch (error) {
                return next(error)
              }
            } else if (req.query) {
              validatedQuery = req.query
            }

            const result = await handler({
              req,
              res,
              body: validatedBody as TBodyValidator,
              query: validatedQuery as TQueryValidator,
            })

            if (!res.headersSent) {
              res.json(result)
            }
          } catch (error) {
            next(error)
          }
        }
      },
    }
  }
}
