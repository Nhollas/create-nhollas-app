import { expect, test } from "@playwright/test"

test.use({ actionTimeout: 10000 })

const buildUrl = (path: string) => `${process.env.BASE_URL}${path}`

test("visit page and take screenshot", async ({ page }) => {
  await page.goto(
    buildUrl(`/playground?secret=${process.env.DRAFTMODE_SECRET}`),
  )

  await page.waitForFunction('typeof window !== "undefined"')
  await page.waitForFunction("window.Clerk !== undefined")
  await page.waitForFunction("window.Clerk.isReady() === true")

  await expect(page.getByText("Welcome To The Playground.")).toBeVisible()

  await page.evaluate(`(async () => {
    const res = await window.Clerk.client.signIn.create({
      identifier: "${process.env.TEST_ACCOUNT_EMAIL}",
      password: "${process.env.TEST_ACCOUNT_PASSWORD}",
    })

    await window.Clerk.setActive({
      session: res.createdSessionId,
    })
  })()`)

  await page.goto(buildUrl("/profile"))

  await page.screenshot({ path: "screenshot.jpg" })

  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible()
  await expect(page.getByText("Manage your account")).toBeVisible()
})
