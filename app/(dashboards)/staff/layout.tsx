import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PrivateRoute from "@/components/private-route"

export const metadata: Metadata = {
  title: "Afrivas - Staff Dashboard",
  description: "Staff portal",
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PrivateRoute allowedRoles={["STAFF"]}>
        <DashboardLayout userRole="STAFF">{children}</DashboardLayout>
      </PrivateRoute>
    </ThemeProvider>
  )
}
