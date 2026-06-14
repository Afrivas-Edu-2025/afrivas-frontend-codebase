import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PrivateRoute from "@/components/private-route"

export const metadata: Metadata = {
  title: "Afrivas - Super Admin Dashboard",
  description: "Super admin portal for platform management",
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
        <DashboardLayout userRole="SUPER_ADMIN">{children}</DashboardLayout>
      </PrivateRoute>
    </ThemeProvider>
  )
}
