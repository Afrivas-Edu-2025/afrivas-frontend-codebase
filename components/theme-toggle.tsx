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
        className="w-9 h-9 rounded-full bg-white dark:bg-gray-800"
      >
        {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-700" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
