import { expect, test } from "@/playwright/fixtures/next-fixture"

test("We can view our home page", async ({ po }) => {
  await po.homePage.goTo()
  await expect(po.homePage.pageHeading).toBeVisible()
})
