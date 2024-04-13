import { faker } from "@faker-js/faker"

import { Example } from "@/app/features/example"

export const exampleGenerator = (overrides?: Partial<Example>): Example => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    ...overrides,
  }
}
