import { type FullConfig } from "@playwright/test"

import {
  setupNextServer,
  setupPlaygroundPage,
  setupStateDirectory,
} from "./setup"
import { persistAuthState } from "./state"

async function globalSetup({}: FullConfig) {
  const port = await setupNextServer()
  const page = await setupPlaygroundPage(port)
  await setupStateDirectory()
  await persistAuthState(page)
}

export default globalSetup
