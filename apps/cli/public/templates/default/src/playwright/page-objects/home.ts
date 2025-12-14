import type { Page } from "@playwright/test"

export type HomePageObject = ReturnType<typeof homePageObject>

export const homePageObject = (page: Page) => {
  const self = {
    goTo: async () => {
      return page.goto("/")
    },
    pageHeading: page.getByRole("heading", { name: "Create Nhollas App" }),
  }

  return Object.assign(page, self)
}
