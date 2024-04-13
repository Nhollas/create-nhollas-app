import fs from "fs"
import { createServer, Server } from "http"
import { AddressInfo } from "net"
import path from "path"
import { parse } from "url"

import { chromium, expect, Page } from "@playwright/test"
import { http, HttpResponse } from "msw"
import { SetupServer } from "msw/node"
import next from "next"

import ExampleService from "@/app/services/Example.service"
import { exampleGenerator } from "@/test/data-generators"

import { buildLocalUrl, playwrightEnv } from "./utils"

export const stateDirectory = "playwright/state"

export async function setupStateDirectory() {
  if (fs.existsSync(stateDirectory)) {
    const files = await fs.promises.readdir(stateDirectory)
    for (const file of files) {
      await fs.promises.unlink(path.join(stateDirectory, file))
    }
  } else {
    await fs.promises.mkdir(stateDirectory, { recursive: true })
  }
}

export async function cleanupStateDirectory() {
  const files = await fs.promises.readdir(stateDirectory)

  for (const file of files) {
    await fs.promises.unlink(path.join(stateDirectory, file))
  }

  await fs.promises.rmdir(stateDirectory)
}

export async function setupPlaygroundPage(port: string) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(
    buildLocalUrl(port, `/playground?secret=${playwrightEnv.DRAFTMODE_SECRET}`)
  )

  await expect(page.getByText("Welcome To The Playground.")).toBeVisible()

  return page
}

export const setupNextServer = async () => {
  const app = next({ dev: false })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server: Server = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url as string, true)
      handle(req, res, parsedUrl)
    })

    server.listen((error: any) => {
      if (error) throw error
      resolve(server)
    })
  })

  const port = String((server.address() as AddressInfo).port)

  return port
}

export const setupMockExample = async (
  requestInterceptor: SetupServer,
  page: Page
) => {
  const example = exampleGenerator()

  requestInterceptor.use(
    http.get(ExampleService.createUrl("/examples"), () =>
      HttpResponse.json([example])
    )
  )

  await page.goto("/examples")

  await expect(page.getByRole("heading", { name: example.title })).toBeVisible()
  await expect(page.getByText(example.description)).toBeVisible()

  return example
}
