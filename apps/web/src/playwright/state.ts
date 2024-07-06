import fs from "fs"
import path from "path"

import { Page, expect } from "@playwright/test"

import { stateDirectory } from "./setup"
import { playwrightEnv } from "./utils"

const { TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASSWORD } = playwrightEnv

export const authStateFile = path.join(stateDirectory, "auth.json")

export const readAuthState = async () => {
  const storageState = JSON.parse(
    await fs.promises.readFile(authStateFile, "utf-8"),
  )

  return storageState
}

export async function persistAuthState(page: Page) {
  await page.waitForFunction('typeof window !== "undefined"')
  await page.waitForFunction("window.Clerk !== undefined")
  await page.waitForFunction("window.Clerk.isReady() === true")

  await expect(page.getByText("Welcome To The Playground.")).toBeVisible()

  await page.evaluate(`(async () => {
    const res = await window.Clerk.client.signIn.create({
      identifier: "${TEST_ACCOUNT_EMAIL}",
      password: "${TEST_ACCOUNT_PASSWORD}",
    })

    await window.Clerk.setActive({
      session: res.createdSessionId,
    })
  })()`)

  await page.context().storageState({ path: authStateFile })
}
