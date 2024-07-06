import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"

test("We can view our profile", async ({ page }) => {
  await page.goto(`/profile`)

  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible()
  await expect(page.getByText("Manage your account")).toBeVisible()
})
