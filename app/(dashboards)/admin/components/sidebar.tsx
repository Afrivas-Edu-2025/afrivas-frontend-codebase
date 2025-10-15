import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Building2,
  UserSquare,
  Layers,
} from "lucide-react"

export default function AdminSidebar() {
  return (
    <div className="w-[200px] bg-[#1a1a1a] p-4 flex flex-col">
      <div className="mb-8 mt-4">
        <Link href="/admin/dashboard" className="flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=60&width=60"
            width={60}
            height={60}
            alt="ePlatform Logo"
            className="text-blue-600"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={true} />
        <SidebarLink href="/admin/users" icon={<Users size={20} />} label="Users" />
        <SidebarLink href="/admin/sections" icon={<Layers size={20} />} label="Sections" />
        <SidebarLink href="/admin/academics" icon={<BookOpen size={20} />} label="Academics" />
        <SidebarLink href="/admin/faculty" icon={<UserSquare size={20} />} label="Faculty" />
        <SidebarLink href="/admin/departments" icon={<Building2 size={20} />} label="Departments" />
        <SidebarLink href="/admin/reports" icon={<FileText size={20} />} label="Reports" />
        <SidebarLink href="/admin/messages" icon={<MessageSquare size={20} />} label="Messages" />
        <SidebarLink href="/admin/calendar" icon={<Calendar size={20} />} label="Calendar" />
        <SidebarLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </div>
  )
}

function SidebarLink({ href, icon, label, active = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-blue-600/10 hover:text-white"}`}
    >
      <span className="text-current">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
