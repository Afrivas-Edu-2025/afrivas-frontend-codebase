"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center">
        <Button variant="outline" size="icon" className="w-9 h-9 rounded-full">
          <Sun className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative w-10 h-10 rounded-full border border-gray-200/50 hover:border-primary-100/30 bg-white/20 hover:bg-primary-100/10 dark:border-gray-700/50 dark:hover:border-primary-100/30 dark:bg-gray-900/20 dark:hover:bg-primary-100/10 backdrop-blur-md transition-all duration-300 shadow-glass group overflow-hidden"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-100/10 to-secondary-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-300 relative z-10" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-300 relative z-10" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
