import { defineConfig } from "checkly"
import { Frequency } from "checkly/constructs"

export default defineConfig({
  projectName: "Next Example Template",
  logicalId: "next-example-template",
  repoUrl: "https://github.com/Nhollas/create-nhollas-app",
  checks: {
    activated: true,
    muted: false,
    runtimeId: "2023.02",
    frequency: Frequency.EVERY_5M,
    locations: ["us-east-1", "eu-west-1"],
    tags: ["website", "api"],
    checkMatch: "**/checkly/**/*.check.ts",
    ignoreDirectoriesMatch: [],
    browserChecks: {
      frequency: Frequency.EVERY_10M,
      testMatch: "**/checkly/**/*.spec.ts",
    },
  },
  cli: {
    runLocation: "eu-west-1",
  },
})
