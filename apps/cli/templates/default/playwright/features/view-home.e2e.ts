import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"

import { playwrightEnv } from "../utils"

test.use({
  extraHTTPHeaders: {
    contextKey: "developer",
    flagSecret: playwrightEnv.FLAG_SECRET,
  },
})

test("We can view our home page", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Create Nhollas App" }),
  ).toBeVisible()

  await expect(page.getByText("Feature Flag Is Enabled 0_0")).toBeVisible()
})
