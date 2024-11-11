"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import Cookies from "js-cookie"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      // persisted == false means reload ok very good
      if (event.persisted) {
        localStorage.clear()
        Cookies.remove("accessToken")
      }
    }

    window.addEventListener("pagehide", handlePageHide)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  )
}
