import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"

export const metadata: Metadata = {
  title: "ePlatform - Teacher Dashboard",
  description: "Teacher portal for the educational platform",
}

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DashboardLayout userRole="teacher">{children}</DashboardLayout>
    </ThemeProvider>
  )
}
