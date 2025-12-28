# create-nhollas-app

## Setting Up The Project

#### Prerequisites

- Node.js
- pnpm

You can check your Node.js and pnpm versions by running:

```bash
node --version
pnpm --version
```

#### 1. Install Dependencies (if not done already through CLI):

```bash
pnpm install
```

#### 2. Install Playwright:

```bash
pnpm exec playwright install --with-deps
```

#### 3. Run Development Server

Finally, run the development server:

```bash
pnpm dev
```

Now you can open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Running Tests

#### Playwright

To run playwright tests, run the following command:

```bash
pnpm test:e2e
```

This will build the application and run the playwright tests.

Note: You don't need to repeatedly build the application once you've done it once. Running the above command at the start will set you up to then simply run:

```bash
pnpm playwright
```

#### Vitest

To run the unit tests with Vitest, run the following command:

```bash
pnpm test:unit
```

## Available Scripts

| Script                  | Description                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Starts the Next.js development server (with Turbopack enabled). Automatically rebuilds on code changes.          |
| `pnpm build`            | Builds a production-ready version of your Next.js application.                                                   |
| `pnpm start`            | Runs the previously built application in production mode.                                                        |
| `pnpm test`             | Runs both unit tests (via Vitest) and end-to-end tests (via Playwright).                                         |
| `pnpm test:unit`        | Runs **Vitest** unit tests.                                                                                      |
| `pnpm test:unit:watch`  | Runs **Vitest** in watch mode for development.                                                                   |
| `pnpm test:e2e`         | Builds the app, then runs **Playwright** tests for end-to-end coverage.                                          |
| `pnpm playwright`       | Directly runs **Playwright** tests (skips the build step).                                                       |
| `pnpm test:coverage`    | Runs Vitest with coverage enabled.                                                                               |
| `pnpm lint`             | Runs ESLint to check for linting issues (does not auto-fix).                                                     |
| `pnpm lint:fix`         | Runs ESLint and automatically fixes fixable issues.                                                               |
| `pnpm format:check`     | Checks if files are formatted according to Prettier rules (does not modify files).                                |
| `pnpm format`           | Formats your code using Prettier.                                                                                 |
| `pnpm typecheck`        | Runs the TypeScript compiler (`tsc`) in noEmit mode to check for type errors.                                    |
| `pnpm validate`         | Checks your code by running `typecheck`, `lint`, and `format:check` sequentially (useful for CI).                |
| `pnpm fix`              | Fixes linting and formatting issues by running `lint:fix` and `format`.                                           |
| `pnpm validate:test`    | Performs all checks (type, lint, format) and then runs the entire test suite.                                    |
