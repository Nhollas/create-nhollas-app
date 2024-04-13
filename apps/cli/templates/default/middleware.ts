import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: (req) => !req.url.includes("/profile"),
  ignoredRoutes: ["/api/(.*)", "/", "/examples", "/playground"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
