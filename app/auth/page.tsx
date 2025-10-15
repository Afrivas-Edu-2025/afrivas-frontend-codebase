import Link from "next/link"
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa"

export default function RoleBasedAccess() {
  return (
    <div className="px-4 pt-4">
      <div className="text-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white/80">Choose Your Role</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {roles.map((role, index) => (
            <Link href={role.href} key={index} className="group">
              <div className="cursor-pointer flex flex-col items-center justify-center rounded-xl bg-white p-6 w-64 h-64 shadow-lg transition transform hover:scale-105 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div
                  className={`flex items-center justify-center w-20 h-20 mb-4 rounded-full ${role.bg} group-hover:opacity-90 dark:bg-gray-700`}
                >
                  {role.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-white/80">{role.title}</h2>
                {/* <p className="text-sm text-gray-600 mt-1">{role.description}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const roles = [
  {
    title: "Login as Student",
    description: "Access classes, assignments & grades",
    icon: <FaUserGraduate size={32} className="text-indigo-600 dark:text-indigo-400" />,
    bg: "bg-indigo-100",
    href: "/auth/student/login",
  },
  {
    title: "Login as Teacher",
    description: "Manage classes & track student progress",
    icon: <FaChalkboardTeacher size={32} className="text-blue-600 dark:text-blue-400" />,
    bg: "bg-blue-100",
    href: "/auth/lecturer/login",
  },
  {
    title: "Login as Admin",
    description: "Oversee school operations & users",
    icon: <FaUserShield size={32} className="text-gray-600 dark:text-gray-400" />,
    bg: "bg-gray-100",
    href: "/auth/admin/login",
  },
]
