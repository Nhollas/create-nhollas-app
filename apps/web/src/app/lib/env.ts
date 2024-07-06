import { z } from "zod"

const envSchema = z.object({
  EXAMPLE_SERVICE_URL: z.string().url(),
  DRAFTMODE_SECRET: z.string(),
  LAUNCHDARKLY_SDK_KEY: z.string(),
  FLAG_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
