# Create Nhollas App

A custom create-next-app cli tool to quickly bootstrap Next.js applications with the tools, patterns and best practices I follow.

## Get Started

```bash
npx create-nhollas-app@latest
```

## Development and Release Process

### Previewing Template Changes

Pushing changes to the `main` branch will trigger the `CI.yml` GitHub action which will:

1. Use the CLI to create a templated project.
2. Run the tests in the newly created project.
3. It will then deploy the project to Vercel.

### Publishing a New Version

To publish a new package version of `create-nhollas-app`:

1. Ensure all your changes are merged to the main branch
2. Go to the GitHub repository release page [here](https://github.com/Nhollas/create-nhollas-app/releases)
3. Click "Draft a new release"
4. Give it a title and describe the changes
5. Create a new tag using semantic versioning (e.g., `1.2.0`)
6. Publish the release

This will trigger the `publish.yml` GitHub action which will:

1. Sets up a Node.js environment
2. Installs all dependencies
3. Extracts the version number from your release tag
4. Updates the package.json version to match
5. Builds the package via the prepublishOnly script
6. Publishes the new version to npm
