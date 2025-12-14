import { test as base, type Route } from "@playwright/test"

import type { SetupServer } from "msw/node"
import { setupNextServer } from "../setup"
import { server } from "@/test/mock-service-worker/server"
import { createPageObjects, type PageObjects } from "../page-objects"
export { expect } from "@playwright/test"

export const test = base.extend<
  {
    po: PageObjects
    serverRequestInterceptor: SetupServer
    interceptBrowserRequest: (
      url: string | RegExp,
      options: Parameters<Route["fulfill"]>[0],
    ) => Promise<void>
  },
  {
    port: string
  }
>({
  baseURL: async ({ port }, use) => {
    await use(`http://localhost:${port}`)
  },
  po: async ({ page }, use) => {
    const po = createPageObjects(page)
    await use(po)
  },
  port: [
    async ({}, use) => {
      const port = await setupNextServer()

      await use(port)
    },
    { auto: true, scope: "worker" },
  ],
  serverRequestInterceptor: [
    async ({}, use) => {
      server.listen({ onUnhandledRequest: "bypass" })

      await use(server)

      server.close()
    },
    {
      scope: "test",
    },
  ],
  interceptBrowserRequest: [
    async ({ page }, use) => {
      async function interceptBrowserRequest(
        url: string | RegExp,
        options: Parameters<Route["fulfill"]>[0],
      ) {
        await page.route(url, async (route) => {
          await route.fulfill(options)
        })
      }

      await use(interceptBrowserRequest)
    },
    { scope: "test" },
  ],
})
