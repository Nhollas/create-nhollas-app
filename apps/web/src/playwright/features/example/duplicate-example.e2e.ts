import { expect } from "@playwright/test"

import test from "@/playwright/fixtures/next-fixture"
import { setupMockExample } from "@/playwright/setup"

test("We can duplicate our examples", async ({ requestInterceptor, page }) => {
  const example = await setupMockExample(requestInterceptor, page)

  await page.getByRole("button", { name: "Duplicate" }).click()

  await expect(page.getByRole("heading", { name: example.title })).toHaveCount(
    2,
  )

  await expect(page.getByText(example.description)).toHaveCount(2)
})
