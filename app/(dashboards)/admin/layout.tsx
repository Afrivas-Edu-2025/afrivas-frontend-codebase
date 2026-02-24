import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import PrivateRoute from "@/components/private-route"
import AdminOnboardingGuard from "@/components/layout/admin-onboarding-guard"

export const metadata: Metadata = {
  title: "ePlatform - Lecturer Dashboard",
  description: "Lecturer portal for the educational platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <PrivateRoute allowedRoles={["ADMIN"]}>
        <AdminOnboardingGuard>{children}</AdminOnboardingGuard>
      </PrivateRoute>
    </ThemeProvider>
  )
}
