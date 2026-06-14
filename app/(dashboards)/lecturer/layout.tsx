import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PrivateRoute from "@/components/private-route"

export const metadata: Metadata = {
  title: "ePlatform - Lecturer Dashboard",
  description: "Lecturer portal for the educational platform",
}

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PrivateRoute allowedRoles={["LECTURER"]}>
        <DashboardLayout userRole="LECTURER">{children}</DashboardLayout>
      </PrivateRoute>
    </ThemeProvider>
  )
}
