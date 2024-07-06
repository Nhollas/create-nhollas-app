import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"
import { setupMockExample } from "@/playwright/setup"

test("We can delete our examples", async ({ requestInterceptor, page }) => {
  const example = await setupMockExample(requestInterceptor, page)

  await page.getByRole("button", { name: "Delete Example" }).click()

  await page.getByRole("button", { name: "Confirm" }).click()

  await expect(page.getByText(example.description)).toBeHidden()
})
