import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"
import { setupMockExample } from "@/playwright/setup"

test("We can edit our examples", async ({ requestInterceptor, page }) => {
  await setupMockExample(requestInterceptor, page)

  await page.getByRole("button", { name: "Update Example" }).click()
  const updatedTitle = `Updated title @ ${Date.now()}`
  const updatedDescription = `Updated description @ ${Date.now()}`

  await page.getByRole("textbox", { name: "title" }).fill(updatedTitle)
  await page
    .getByRole("textbox", { name: "description" })
    .fill(updatedDescription)

  await page.getByRole("button", { name: "Save" }).click()

  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible()

  await expect(page.getByText(updatedDescription)).toBeVisible()
})
