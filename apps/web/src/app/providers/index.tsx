import { ClerkProvider } from "@clerk/nextjs"

import QueryClientProvider from "./QueryClientProvider"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ClerkProvider>
  )
}

export default Providers
