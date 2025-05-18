import { render } from "vitest-browser-react"
import { page } from "@vitest/browser/context"
import Page from "./page.tsx"

test("renders name", async () => {
  render(<Page />)
  const headline = page.getByRole("heading", { name: "Create Nhollas App" })

  expect(headline).toBeInTheDocument()
})
