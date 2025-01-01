/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    optimizePackageImports: ["@/app/components/ui"],
  },
}

module.exports = nextConfig
