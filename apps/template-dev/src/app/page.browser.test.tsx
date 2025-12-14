import { render } from "vitest-browser-react"
import Page from "./page.tsx"
import { page } from "vitest/browser"

test("renders heading", async () => {
  await render(<Page />)
  const headline = page.getByRole("heading", { name: "Create Nhollas App" })

  await expect.element(headline).toBeVisible()
})
