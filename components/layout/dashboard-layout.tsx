"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import UnifiedSidebar from "@/components/layout/unified-sidebar"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { getUniversityOnboardingProfile } from "@/lib/universityOnboarding"
import DashboardRealtimeBridge from "@/components/realtime/dashboard-realtime-bridge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

type DashboardLayoutProps = {
  children: ReactNode
  userRole: "ADMIN" | "STUDENT" | "LECTURER" | "admin" | "student" | "lecturer"
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const normalizedRole = String(userRole).toUpperCase() as "ADMIN" | "STUDENT" | "LECTURER"
  const roleSegment = normalizedRole.toLowerCase()

  const onboardingProfile = normalizedRole === "ADMIN" ? getUniversityOnboardingProfile(user?.id) : null
  const sidebarLogo = onboardingProfile?.logoDataUrl || user?.universityLogoUrl || user?.school?.schoolLogo || "/images/logo.webp"
  const sidebarBrand = onboardingProfile?.universityName || user?.universityName || user?.school?.schoolName || "Afrivas"

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)

    // Don't show breadcrumbs on the main dashboard page
    if (paths.length <= 2) {
      return null
    }

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href={`/${roleSegment}/dashboard`}>
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {paths.slice(1).map((path, index) => {
            const href = `/${paths.slice(0, index + 2).join("/")}`
            const isLast = index === paths.slice(1).length - 1

            // Format the path for display
            const formattedPath = path
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <span className="font-medium">{formattedPath}</span>
                  ) : (
                    <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-50 overflow-hidden relative">
      <DashboardRealtimeBridge />

      {/* Decorative background elements like the landing page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-100/5 blur-[120px]" />
      </div>
      <UnifiedSidebar userRole={normalizedRole} logoSrc={sidebarLogo} brandName={sidebarBrand} onToggle={handleSidebarToggle} />
      <div
        className={cn(
          "min-h-screen transition-all duration-500 ease-in-out relative z-10",
          sidebarCollapsed || isMobile ? "pl-0 lg:pl-[70px]" : "pl-0 lg:pl-[260px]",
        )}
      >
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-3rem)] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {generateBreadcrumbs()}
              <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {children}
              </main>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
