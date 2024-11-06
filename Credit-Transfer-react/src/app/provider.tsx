"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import Cookies from "js-cookie"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear()
      Cookies.remove("accessToken")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  )
}
