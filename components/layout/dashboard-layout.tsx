"use client"

import React from "react"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import UnifiedSidebar from "@/components/layout/unified-sidebar"
import { usePathname } from "next/navigation"
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
  userRole: "ADMIN" | "STUDENT" | "LECTURER"
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

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
            <BreadcrumbLink href={`/${userRole}/dashboard`}>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar userRole={userRole} onToggle={handleSidebarToggle} />

      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed || isMobile ? "pl-0 lg:pl-[70px]" : "pl-0 lg:pl-[240px]",
        )}
      >
        <div className="min-h-screen bg-white dark:bg-gray-800 lg:rounded-tl-lg shadow-sm">
          <div className="p-4 md:p-6">
            {generateBreadcrumbs()}

            <main className="mt-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
