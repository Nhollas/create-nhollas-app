import { test, expect } from "vitest"

import { render, screen } from "@/test/utils"

import { HomeCard } from "../HomeCard"

test("Has title of 'Nextjs Starter Template' and displays todays date", async () => {
  render(<HomeCard />)

  expect(screen.getByText(new Date().toDateString())).toBeDefined()
  expect(screen.getByText("Nextjs Starter Template")).toBeDefined()
})
