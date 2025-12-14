import { Page } from "@playwright/test"
import { homePageObject } from "./home"

export type PageObjects = ReturnType<typeof createPageObjects>

export const createPageObjects = (page: Page) => {
  const pageObjects = {
    homePage: homePageObject(page),
  }

  return pageObjects
}
