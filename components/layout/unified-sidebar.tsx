"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  User,
  LogOut,
  GraduationCap,
  ClipboardList,
  Clock,
  Award,
  BookMarked,
  Building2,
  Layers,
  Download,
  ChartBar,
  Shield,
} from "lucide-react"

// Define the navigation item type
type NavItem = {
  href?: string
  icon: React.ReactNode
  label: string
  section?: string
  onClick?: () => void
}

// Define the props for the UnifiedSidebar component
type UnifiedSidebarProps = {
  userRole: "SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "ADMIN" | "STUDENT" | "LECTURER"
  logoSrc?: string
  onToggle?: (collapsed: boolean) => void
}

export default function UnifiedSidebar({ userRole, logoSrc = "../images/logo.webp", onToggle }: UnifiedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const sidebarRef = useRef<HTMLElement>(null)

  // Check if the current path matches the nav item href
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024
      setIsMobile(newIsMobile)
      if (newIsMobile && !isMobileOpen) {
        setIsCollapsed(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isMobileOpen])

  // Handle sidebar toggle
  const toggleSidebar = () => {
    const newIsCollapsed = !isCollapsed
    setIsCollapsed(newIsCollapsed)
    if (onToggle) {
      onToggle(newIsCollapsed)
    }
  }

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = () => {
    const newIsMobileOpen = !isMobileOpen
    setIsMobileOpen(newIsMobileOpen)
    if (onToggle && isMobile) {
      onToggle(!newIsMobileOpen)
    }
  }

  // Define navigation items based on user role
  const getNavItems = (): { [key: string]: NavItem[] } => {
    const commonItems: NavItem[] = [
      {
        href: `/${userRole}/dashboard/settings`,
        icon: <Settings size={20} />,
        label: "Settings",
        section: "Common",
      },
      {
        href: `/${userRole}/dashboard/notifications`,
        icon: <Bell size={20} />,
        label: "Notifications",
        section: "Common",
      },
      {
        icon: <LogOut size={20} />,
        label: "Logout",
        section: "Common",
        onClick: () => {
          logout()
          router.push("/login")
        },
      },
    ]

    switch (userRole) {
      case "SUPER_ADMIN":
        return {
          Main: [
            {
              href: "/super-admin/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
            {
              href: "/super-admin/universities",
              icon: <Building2 size={20} />,
              label: "Universities",
            },
            {
              href: "/super-admin/admins",
              icon: <Shield size={20} />,
              label: "Admin Users",
            },
          ],
          Common: commonItems,
        }
      case "UNIVERSITY_ADMIN":
      case "ADMIN":
        return {
          Main: [
            {
              href: "/admin/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
            {
              href: "/admin/users/students",
              icon: <GraduationCap size={20} />,
              label: "Students",
            },
            {
              href: "/admin/users/lecturers",
              icon: <User size={20} />,
              label: "Lecturers",
            },

          ],
          Management: [
            {
              href: "/admin/courses",
              icon: <BookOpen size={20} />,
              label: "Courses",
            },
            {
              href: "/admin/classes",
              icon: <Layers size={20} />,
              label: "Classes",
            },
            {
              href: "/admin/grades",
              icon: <ChartBar size={20} />,
              label: "Grades",
            },
            {
              href: "/admin/faculty",
              icon: <User size={20} />,
              label: "Faculty",
            },
            {
              href: "/admin/departments",
              icon: <Building2 size={20} />,
              label: "Departments",
            },
            {
              href: "/admin/messages",
              icon: <MessageSquare size={20} />,
              label: "Messages",
            },
            {
              href: "/admin/calendar",
              icon: <Calendar size={20} />,
              label: "Calendar",
            },
          ],
          Common: commonItems,
        }
      case "STUDENT":
        return {
          Main: [
            {
              href: "/student/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
          ],
          Academics: [
            {
              href: "/student/dashboard/academics/insights",
              icon: <GraduationCap size={20} />,
              label: "Insights",
            },
            {
              href: "/student/dashboard/academics/attendance",
              icon: <ClipboardList size={20} />,
              label: "Attendance",
            },
            {
              href: "/student/dashboard/academics/timetable",
              icon: <Clock size={20} />,
              label: "Time Table",
            },
            {
              href: "/student/dashboard/academics/assignments",
              icon: <FileText size={20} />,
              label: "Assignments",
            },
          ],
          Course: [
            {
              href: "/student/dashboard/course/grades",
              icon: <Award size={20} />,
              label: "Grades",
            },
            {
              href: "/student/dashboard/course/resources",
              icon: <BookMarked size={20} />,
              label: "Resources",
            },
          ],
          Others: [
            {
              href: "/student/dashboard/events/upcoming",
              icon: <Calendar size={20} />,
              label: "Events",
            },
            {
              href: "/student/dashboard/messages",
              icon: <MessageSquare size={20} />,
              label: "Messages",
            },
          ],
          Common: commonItems,
        }
      case "LECTURER":
        return {
          Main: [
            {
              href: "/lecturer/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
            {
              href: "/lecturer/dashboard/students",
              icon: <Users size={20} />,
              label: "Students",
            },
          ],
          Teaching: [
            {
              href: "/lecturer/dashboard/grades",
              icon: <GraduationCap size={20} />,
              label: "Grades",
            },
            {
              href: "/lecturer/dashboard/resources",
              icon: <Download size={20} />,
              label: "Resources",
            },
          ],
          Resources: [
            {
              href: "/lecturer/dashboard/messages",
              icon: <MessageSquare size={20} />,
              label: "Messages",
            },
            {
              href: "/lecturer/dashboard/calendar",
              icon: <Calendar size={20} />,
              label: "Calendar",
            },
          ],
          Common: commonItems,
        }
      default:
        return { Common: commonItems }
    }
  }

  const navItems = getNavItems()

  // Mobile overlay for sidebar
  const MobileOverlay = () => {
    if (!isMobile || !isMobileOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={toggleMobileSidebar} />
    )
  }

  return (
    <>
      <MobileOverlay />

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
          aria-label="Toggle Sidebar"
        >
          {isMobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col border-r shadow-sm",
          "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        {/* Logo and Toggle Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href={`/${userRole}/dashboard`} className={cn("flex items-center", isCollapsed && "justify-center")}>
            <Image src={logoSrc || "/placeholder.svg"} width={32} height={32} alt="Logo" className="rounded-md" />
            {!isCollapsed && <span className="ml-2 font-semibold text-gray-800 dark:text-white">Afrivas</span>}
          </Link>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 py-2">
          <TooltipProvider delayDuration={0}>
            <div className="px-3 space-y-6">
              {Object.entries(navItems).map(([section, items]) => (
                <div key={section}>
                  {!isCollapsed && (
                    <h3 className="mb-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {items.map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href || "#"}
                              onClick={item.onClick}
                              className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive(item.href || "")
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                isCollapsed && "justify-center",
                              )}
                            >
                              <span className="text-current">{item.icon}</span>
                              {!isCollapsed && <span className="ml-3">{item.label}</span>}
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </ScrollArea>

        {/* Version Info */}
        <div
          className={cn(
            "p-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800",
            isCollapsed && "text-center",
          )}
        >
          {isCollapsed ? "v1.0" : "Afrivas Platform v1.0"}
        </div>
      </aside>
    </>
  )
}
