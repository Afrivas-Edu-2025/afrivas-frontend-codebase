import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PrivateRoute from "@/components/private-route"

export const metadata: Metadata = {
  title: "ePlatform - Student Dashboard",
  description: "Student portal for the educational platform",
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PrivateRoute allowedRoles={["STUDENT"]}>
        <DashboardLayout userRole="STUDENT">{children}</DashboardLayout>
      </PrivateRoute>
    </ThemeProvider>
  )
}
