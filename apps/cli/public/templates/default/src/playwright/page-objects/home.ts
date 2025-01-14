import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

export type TestArgs = {
  page: Page
}

export const createHomePageObject = (testArgs: TestArgs) => {
  const { page } = testArgs

  const self = {
    goTo: async () => {
      return page.goto("/")
    },
    expectHeadingToBeVisible: async (name: string) => {
      return expect(page.getByRole("heading", { name })).toBeVisible()
    },
  }

  return Object.assign(page, self)
}
