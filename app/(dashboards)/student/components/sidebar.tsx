import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Award,
  BookMarked,
  Settings,
  MessageSquare,
} from "lucide-react"

export default function StudentSidebar() {
  return (
    <div className="w-[200px] bg-[#1a1a1a] p-4 flex flex-col">
      <div className="mb-8 mt-4">
        <Link href="/student/dashboard" className="flex items-center justify-center">
          <Image src="/images/logo.webp" width={60} height={60} alt="Afrivas Logo" className="text-blue-600" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarLink href="/student/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={true} />

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Academics</p>
        </div>
        <SidebarLink href="/student/dashboard/academics/insights" icon={<GraduationCap size={20} />} label="Insights" />
        <SidebarLink
          href="/student/dashboard/academics/attendance"
          icon={<ClipboardList size={20} />}
          label="Attendance"
        />
        <SidebarLink href="/student/dashboard/academics/timetable" icon={<Clock size={20} />} label="Time Table" />
        <SidebarLink
          href="/student/dashboard/academics/assignments"
          icon={<FileText size={20} />}
          label="Assignments"
        />
        <SidebarLink href="/student/dashboard/academics/assessments" icon={<Award size={20} />} label="Assessments" />

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</p>
        </div>
        <SidebarLink href="/student/dashboard/course/models" icon={<BookOpen size={20} />} label="Models" />
        <SidebarLink href="/student/dashboard/course/grades" icon={<Award size={20} />} label="Grades" />
        <SidebarLink href="/student/dashboard/course/exams" icon={<ClipboardList size={20} />} label="Exams" />
        <SidebarLink href="/student/dashboard/course/resources" icon={<BookMarked size={20} />} label="Resources" />

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Others</p>
        </div>
        <SidebarLink href="/student/dashboard/events/upcoming" icon={<Calendar size={20} />} label="Events" />
        <SidebarLink href="/student/dashboard/messages" icon={<MessageSquare size={20} />} label="Messages" />
        <SidebarLink href="/student/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
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
