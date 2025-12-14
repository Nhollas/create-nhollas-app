import { createServer, Server } from "http"
import type { AddressInfo } from "net"
import { parse } from "url"

import next from "next"

export const setupNextServer = async () => {
  const app = next({ dev: false })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server: Server = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(String(req.url), true)
      void handle(req, res, parsedUrl)
    })

    server.listen((error: unknown) => {
      if (error)
        throw new Error(error instanceof Error ? error.message : "Server error")
      resolve(server)
    })
  })

  const port = String((server.address() as AddressInfo).port)

  return port
}
