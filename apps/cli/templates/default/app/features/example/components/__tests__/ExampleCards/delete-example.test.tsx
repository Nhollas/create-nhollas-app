vi.mock("@/app/lib/env")
import { HttpResponse, http } from "msw"
import { it, expect } from "vitest"

import { ExampleCards } from "@/app/features/example"
import NextApiService from "@/app/services/NextApi.service"
import { exampleGenerator } from "@/test/data-generators"
import { server } from "@/test/server"
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/utils"

it("Successfully deleting an example:", async () => {
  const exampleToDelete = exampleGenerator()

  server.use(
    http.delete(NextApiService.createUrl(`/example`), () =>
      HttpResponse.json({}, { status: 200 }),
    ),
    http.get(NextApiService.createUrl("/examples"), () =>
      HttpResponse.json([exampleToDelete]),
    ),
  )

  renderWithProviders(<ExampleCards examples={[exampleToDelete]} />)

  // [1] We should initiate the delete action of an example card with a button.
  await waitFor(() => {
    const deleteButton = screen.getByRole("button", {
      name: "Delete Example",
    })

    expect(deleteButton).toBeInTheDocument()
  })

  // [2] We should be prompted with a modal asking to confirm that we want to delete the example.
  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete Example",
    }),
  )

  await waitFor(() => {
    const modal = screen.getByRole("alertdialog", {
      name: "Are you sure you want to delete this example?",
    })
    expect(modal).toBeInTheDocument()
  })

  // [3] We will then need to confirm the deletion of the example.
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }))

  // [4] The deleted example card should be removed from the list of example cards.
  await waitFor(() => {
    expect(
      screen.queryByRole("heading", { name: exampleToDelete.title }),
    ).not.toBeInTheDocument()
  })
})
