import { render, screen } from "@testing-library/react"

import { HomeCard } from "./home-card"

test("Has title of 'Create Nhollas App' and displays todays date", async () => {
  render(<HomeCard />)

  expect(screen.getByText(new Date().toDateString())).toBeDefined()
  expect(screen.getByText("Create Nhollas App")).toBeDefined()
})
