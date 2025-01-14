import { Page } from "@playwright/test"
import { createHomePageObject } from "./page-objects/home"

export const buildLocalUrl = (port: string, path: string = "") =>
  `http://localhost:${port}${path}`

type TestUtilsArgs = {
  page: Page
}
export const createTestUtils = (params: TestUtilsArgs) => {
  const { page } = params
  const pageObjects = {
    homePage: createHomePageObject(params),
  }

  return {
    po: pageObjects,
    page,
  }
}
