# Create Nhollas App

The easiest way to get started with Next.js is by using `create-nhollas-app`. This CLI tool enables you to quickly start building a new Next.js application, with everything set up for you. To get started, use the following command:

### Interactive

You can create a new project interactively by running:

```bash
npx create-nhollas-app@latest
# or
yarn create nhollas-app
# or
pnpm create nhollas-app
# or
bunx create-nhollas-app
```

You will be asked for the name of your project, if you want to use the `src` directory as the root of your project and if you want to alter the default import alias.

### Why use Create Nhollas App?

`create-nhollas-app` sets up your Next.js project with the following features:

- **Automatic TypeScript Configuration**: Next.js is configured to use TypeScript by default, so you don't have to worry about setting it up.
- **E2E Testing with Playwright**: Your project is set up with Playwright for end-to-end testing.
- **Intergration Testing with Testing Library**: Your project is set up with Testing Library for integration testing.
- **Linting with ESLint**: Your project is set up with ESLint for linting.
- **Formatting with Prettier**: Your project is set up with Prettier for formatting.
- **Husky and Lint-Staged**: Your project is set up with Husky and Lint-Staged to run ESLint and Prettier and your tests before every commit.
