"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useAuth } from "@/components/auth-context"
import { useUniversityOnboardingProfile } from "@/hooks/useUniversityOnboarding"

export default function AdminOnboardingGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const isOnboardingRoute = pathname.startsWith("/admin/onboarding")

  // Always check the database — never use localStorage as the authority here.
  const { data: onboardingData, isLoading: onboardingLoading } = useUniversityOnboardingProfile()
  const onboardingDone = Boolean(onboardingData?.isComplete)

  useEffect(() => {
    if (loading || onboardingLoading || !user) return

    if (!onboardingDone && !isOnboardingRoute) {
      router.replace("/admin/onboarding")
      return
    }

    if (onboardingDone && isOnboardingRoute) {
      router.replace("/admin/dashboard")
    }
  }, [loading, user, onboardingDone, isOnboardingRoute, onboardingLoading, router])

  // Show nothing while we're waiting for auth or the DB check to resolve.
  if (loading || !user) return null

  // While fetching onboarding status from DB, show a minimal spinner so
  // the user isn't briefly redirected to the wrong page.
  if (onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      </div>
    )
  }

  if (!onboardingDone && !isOnboardingRoute) return null
  if (onboardingDone && isOnboardingRoute) return null

  if (isOnboardingRoute) {
    return <>{children}</>
  }

  return <DashboardLayout userRole="ADMIN">{children}</DashboardLayout>
}
