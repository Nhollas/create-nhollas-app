import { cleanupStateDirectory } from "./setup"

async function globalTeardown() {
  await cleanupStateDirectory()
}

export default globalTeardown
