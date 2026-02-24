"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useAuth } from "@/components/auth-context"
import { isUniversityOnboardingComplete } from "@/lib/universityOnboarding"

export default function AdminOnboardingGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const isOnboardingRoute = pathname.startsWith("/admin/onboarding")
  const onboardingDone = isUniversityOnboardingComplete(user?.id)

  useEffect(() => {
    if (loading || !user) return

    if (!onboardingDone && !isOnboardingRoute) {
      router.replace("/admin/onboarding")
      return
    }

    if (onboardingDone && isOnboardingRoute) {
      router.replace("/admin/dashboard")
    }
  }, [loading, user, onboardingDone, isOnboardingRoute, router])

  if (loading || !user) return null

  if (!onboardingDone && !isOnboardingRoute) return null
  if (onboardingDone && isOnboardingRoute) return null

  if (isOnboardingRoute) {
    return <>{children}</>
  }

  return <DashboardLayout userRole="ADMIN">{children}</DashboardLayout>
}

