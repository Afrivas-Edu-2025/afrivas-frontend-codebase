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
import ThemeToggle from "@/components/theme-toggle"
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
} from "lucide-react"

// Define the navigation item type
type NavItem = {
  href?: string
  icon: React.ReactNode
  label: string
  section?: string
  onClick?: () => void
  disabled?: boolean
}

// Define the props for the UnifiedSidebar component
type UnifiedSidebarProps = {
  userRole: "ADMIN" | "STUDENT" | "LECTURER" | "SUPER_ADMIN" | "STAFF"
  logoSrc?: string
  brandName?: string
  onToggle?: (collapsed: boolean) => void
}

export default function UnifiedSidebar({ userRole, logoSrc = "../images/logo.webp", brandName = "Afrivas", onToggle }: UnifiedSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const sidebarRef = useRef<HTMLElement>(null)
  const normalizedRole = String(userRole).toUpperCase() as "ADMIN" | "STUDENT" | "LECTURER" | "SUPER_ADMIN" | "STAFF"
  const roleSegment = normalizedRole.toLowerCase()

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
        href: `/${roleSegment}/dashboard/settings`,
        icon: <Settings size={20} />,
        label: "Settings",
        section: "Common",
      },
      {
        href: `/${roleSegment}/dashboard/notifications`,
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

    switch (normalizedRole) {
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
              href: "/admin/module",
              icon: <BookOpen size={20} />,
              label: "Module",
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
              disabled: true,
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
              href: "/admin/notices",
              icon: <Bell size={20} />,
              label: "Notices",
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
      case "SUPER_ADMIN":
        return {
          Main: [
            {
              href: "/super-admin/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
            },
          ],
          Management: [
            {
              href: "/super-admin/universities",
              icon: <Building2 size={20} />,
              label: "Universities",
            },
            {
              href: "/super-admin/users",
              icon: <Users size={20} />,
              label: "All Users",
            },
          ],
          Common: commonItems,
        }
      case "STAFF":
        return {
          Main: [
            {
              href: "/staff/dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Dashboard",
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
          "fixed top-0 left-0 z-40 h-screen transition-all duration-500 ease-in-out flex flex-col border-r",
          "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-white/20 dark:border-gray-800/50",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        {/* Logo and Toggle Section */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/5">
          <Link href={`/${roleSegment}/dashboard`} className={cn("flex items-center group", isCollapsed && "justify-center")}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-tr from-primary-100 to-secondary-100 opacity-70 blur group-hover:opacity-100 transition duration-300" />
              {typeof logoSrc === "string" && logoSrc.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoSrc}
                  width={36}
                  height={36}
                  alt="Logo"
                  className="relative rounded-lg border border-white/20 shadow-lg"
                />
              ) : (
                <Image 
                  src={logoSrc || "/placeholder.svg"} 
                  width={36} 
                  height={36} 
                  alt="Logo" 
                  className="relative rounded-lg border border-white/20 shadow-lg"
                />
              )}
            </div>
            {!isCollapsed && (
              <span className="ml-3 font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {brandName}
              </span>
            )}
          </Link>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-primary-100 dark:text-gray-400 dark:hover:text-primary-100 hover:bg-primary-100/10 transition-all rounded-full h-8 w-8"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <div className="px-4 space-y-8">
              {Object.entries(navItems).map(([section, items]) => (
                <div key={section}>
                  {!isCollapsed && (
                    <h3 className="mb-3 px-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                      {section}
                    </h3>
                  )}
                  <ul className="space-y-1.5">
                    {items.map((item, index) => (
                      <li key={`${section}-${item.href ?? item.label}-${index}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {item.disabled ? (
                              <div
                                className={cn(
                                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold relative overflow-hidden cursor-not-allowed select-none",
                                  "text-gray-400 dark:text-gray-600 opacity-60",
                                  isCollapsed && "justify-center",
                                )}
                                aria-disabled="true"
                              >
                                <span className="relative z-10">
                                  {item.icon}
                                </span>
                                {!isCollapsed && (
                                  <span className="relative z-10 ml-3 truncate font-medium">
                                    {item.label}
                                  </span>
                                )}
                              </div>
                            ) : item.onClick && !item.href ? (
                              <button
                                onClick={item.onClick}
                                className={cn(
                                  "w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                                  item.label === "Logout"
                                    ? "text-rose-500 border border-rose-500/40 bg-transparent hover:bg-rose-500 hover:text-white hover:border-rose-500"
                                    : "text-gray-600 dark:text-gray-400 hover:text-primary-100 dark:hover:text-primary-100 hover:bg-primary-100/5",
                                  isCollapsed && "justify-center",
                                )}
                              >
                                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                                  {item.icon}
                                </span>
                                {!isCollapsed && (
                                  <span className="relative z-10 ml-3 truncate font-medium">
                                    {item.label}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <Link
                                href={item.href || "#"}
                                onClick={item.onClick}
                                className={cn(
                                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                                  isActive(item.href || "")
                                    ? "text-white shadow-neon-primary"
                                    : "text-gray-600 dark:text-gray-400 hover:text-primary-100 dark:hover:text-primary-100 hover:bg-primary-100/5",
                                  isCollapsed && "justify-center",
                                )}
                              >
                                {isActive(item.href || "") && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-100/80 z-0" />
                                )}
                                <span className={cn(
                                  "relative z-10 transition-transform duration-300 group-hover:scale-110",
                                  isActive(item.href || "") ? "text-white" : "text-current"
                                )}>
                                  {item.icon}
                                </span>
                                {!isCollapsed && (
                                  <span className="relative z-10 ml-3 truncate font-medium">
                                    {item.label}
                                  </span>
                                )}
                                {!isActive(item.href || "") && !isCollapsed && (
                                  <div className="absolute left-0 w-1 h-0 bg-primary-100 group-hover:h-1/2 transition-all duration-300" />
                                )}
                              </Link>
                            )}
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" className="font-semibold">
                              {item.disabled ? `${item.label} (Coming Soon)` : item.label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </ScrollArea>


        {/* Theme Toggle Section */}
        <div className={cn("px-6 py-4 border-t border-white/10 dark:border-white/5", isCollapsed && "px-0 flex justify-center")}>
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <ThemeToggle />
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Theme Mode
              </span>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div
          className={cn(
            "p-6 text-xs font-semibold text-gray-400 dark:text-gray-500 border-t border-white/10 dark:border-white/5",
            isCollapsed && "text-center",
          )}
        >
          {isCollapsed ? "v1.0" : (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
              <span>{brandName} Platform v1.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
