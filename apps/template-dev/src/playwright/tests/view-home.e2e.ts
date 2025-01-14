import test from "src/playwright/fixtures/next-fixture"

test("We can view our home page", async ({ po }) => {
  await po.homePage.goTo()
  await po.homePage.expectHeadingToBeVisible("Create Nhollas App")
})
