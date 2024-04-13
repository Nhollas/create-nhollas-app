vi.mock("@/app/lib/env")
import { faker } from "@faker-js/faker"
import { HttpResponse, http } from "msw"
import { it, expect } from "vitest"

import { ExampleCards } from "@/app/features/example"
import NextApiService from "@/app/services/NextApi.service"
import { exampleGenerator } from "@/test/data-generators"
import { server, withJsonBody } from "@/test/server"
import { fireEvent, renderWithProviders, screen, waitFor } from "@/test/utils"

it("Successfully duplicating an example:", async () => {
  const exampleToDuplicate = exampleGenerator()

  server.use(
    http.post(
      NextApiService.createUrl("/example/duplicate"),
      withJsonBody(exampleToDuplicate, () => {
        return HttpResponse.json(
          exampleGenerator({
            ...exampleToDuplicate,
            id: faker.string.uuid(),
          }),
        )
      }),
    ),
    http.get(NextApiService.createUrl("/examples"), () =>
      HttpResponse.json([exampleToDuplicate]),
    ),
  )

  renderWithProviders(<ExampleCards examples={[exampleToDuplicate]} />)

  // [1] We should start the duplication of an example card with a button.
  await waitFor(() => {
    const duplicateButton = screen.getByRole("button", {
      name: "Duplicate",
    })

    expect(duplicateButton).toBeInTheDocument()
  })

  // [2] We should be able to see the duplicated example card after clicking the button.
  fireEvent.click(
    screen.getByRole("button", {
      name: "Duplicate",
    }),
  )

  // [3] The duplicated example card should have the same content as the original example card.
  await waitFor(() => {
    expect(
      screen.getAllByRole("heading", { name: exampleToDuplicate.title }),
    ).toHaveLength(2)
  })

  expect(screen.getAllByText(exampleToDuplicate.description)).toHaveLength(2)

  const headings = screen.getAllByRole("heading", {
    name: exampleToDuplicate.title,
  })
  expect(headings).toHaveLength(2)
})
