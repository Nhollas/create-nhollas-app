import { test, expect } from "vitest"

import { render, screen } from "@/test/utils"

import { HomeCard } from "../HomeCard"

test("Has title of 'Create Nhollas App' and displays todays date", async () => {
  render(<HomeCard />)

  expect(screen.getByText(new Date().toDateString())).toBeDefined()
  expect(screen.getByText("Create Nhollas App")).toBeDefined()
})
