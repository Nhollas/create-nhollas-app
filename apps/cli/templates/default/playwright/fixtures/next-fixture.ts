import { Page, test as base } from "@playwright/test"
import { type SetupServer } from "msw/node"

import { server } from "@/test/server"

import { setupNextServer } from "../setup"
import { readAuthState } from "../state"
import { buildLocalUrl, overrideStateOrigin, playwrightEnv } from "../utils"

const { DRAFTMODE_SECRET } = playwrightEnv

export const test = base.extend<
  {
    revalidatePath: (page: Page, path: string) => Promise<void>
  },
  {
    port: string
    requestInterceptor: SetupServer
  }
>({
  baseURL: async ({ port }, use) => {
    await use(buildLocalUrl(port))
  },
  storageState: async ({ port }, use) => {
    const authState = await readAuthState()

    const updatedAuthState = await overrideStateOrigin(authState, port)

    await use(updatedAuthState)
  },
  port: [
    async ({}, use) => {
      const port = await setupNextServer()

      await use(port)
    },
    { auto: true, scope: "worker" },
  ],
  requestInterceptor: [
    async ({}, use) => {
      server.listen({ onUnhandledRequest: "warn" })

      await use(server)

      server.resetHandlers()
      server.close()
    },
    {
      scope: "worker",
    },
  ],
  revalidatePath: async ({ port }, use) => {
    async function revalidatePath(page: Page, path: string) {
      await page.goto(
        buildLocalUrl(
          port,
          `/api/revalidate?secret=${DRAFTMODE_SECRET}&path=${path}`,
        ),
      )
    }

    await use(revalidatePath)
  },
})

export default test
