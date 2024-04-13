import { z } from "zod"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

export const overrideStateOrigin = async (state: any, port: string) => {
  // Update the origin to the local server this test is running on.
  state.origins[0].origin = buildLocalUrl(port)

  return state
}

export const playwrightEnv = z
  .object({
    DRAFTMODE_SECRET: z.string(),
    TEST_ACCOUNT_EMAIL: z.string(),
    TEST_ACCOUNT_PASSWORD: z.string(),
    FLAG_SECRET: z.string(),
  })
  .parse(process.env)
