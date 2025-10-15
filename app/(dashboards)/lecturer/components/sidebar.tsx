import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Users, GraduationCap, Download, MessageSquare, Calendar, Settings } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-[200px] bg-gray-200 dark:bg-[#1a1a1a] p-4 flex flex-col">
      <div className="mb-8 mt-4">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/images/logo.webp"
            width={60}
            height={60}
            alt="Afrivas Logo"
            className="text-blue-600 rounded-lg"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarLink href="/teacher/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink href="/teacher/dashboard/students" icon={<Users size={20} />} label="Students" />
        <SidebarLink href="/teacher/dashboard/grades" icon={<GraduationCap size={20} />} label="Grades" />
        {/* <SidebarLink href="/teacher/dashboard/assignments" icon={<FileText size={20} />} label="Assignments" /> */}
        <SidebarLink href="/teacher/dashboard/resources" icon={<Download size={20} />} label="Resources" />
        <SidebarLink href="/teacher/dashboard/messages" icon={<MessageSquare size={20} />} label="Messages" />
        <SidebarLink href="/teacher/dashboard/calendar" icon={<Calendar size={20} />} label="Calender" />
        {/* <SidebarLink href="/teacher/dashboard/classroom" icon={<MonitorPlay size={20} />} label="Live Classroom" /> */}
        <SidebarLink href="/teacher/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </div>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={`${href}`}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${href === "/dashboard" ? "bg-blue-600 text-white" : " text-gray-600 dark:text-gray-00 hover:bg-blue-600/20 hover:text-gray-700"}`}
    >
      <span className="text-current">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
