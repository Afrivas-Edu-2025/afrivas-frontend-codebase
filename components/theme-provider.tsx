"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <NextThemesProvider {...props} suppressHydrationWarning>
      {children}
    </NextThemesProvider>
  )
}
