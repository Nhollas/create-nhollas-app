export type PackageManager = "npm" | "pnpm"

export function getPkgManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent || ""

  if (userAgent.startsWith("pnpm")) {
    return "pnpm"
  }

  return "npm"
}
