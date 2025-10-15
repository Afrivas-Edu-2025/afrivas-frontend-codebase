import Image from "next/image"
import Link from "next/link"
import { Filter, Download } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500">Manage Users and their resources</p>
        </div>
      </div>

      {/* User Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users/staff" className="block">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <Image
                src="/placeholder.svg?height=150&width=200"
                width={200}
                height={150}
                alt="Staff illustration"
                className="mb-4"
              />
              <h2 className="text-xl font-bold text-center">STAFFS</h2>
            </div>
          </div>
        </Link>

        <Link href="/admin/users/lecturers" className="block">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <Image
                src="/placeholder.svg?height=150&width=200"
                width={200}
                height={150}
                alt="Lecturers illustration"
                className="mb-4"
              />
              <h2 className="text-xl font-bold text-center">LECTURERS</h2>
            </div>
          </div>
        </Link>

        <Link href="/admin/users/students" className="block">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <Image
                src="/placeholder.svg?height=150&width=200"
                width={200}
                height={150}
                alt="Students illustration"
                className="mb-4"
              />
              <h2 className="text-xl font-bold text-center">STUDENTS</h2>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent User Activity */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent User Activity</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
              <Filter size={14} />
              Filter
            </button>
            <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {activity.user.avatar ? (
                          <Image
                            src={activity.user.avatar || "/placeholder.svg"}
                            width={40}
                            height={40}
                            alt={activity.user.name}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {activity.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{activity.user.name}</div>
                        <div className="text-sm text-gray-500">{activity.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const userActivities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Updated system settings",
    time: "10 minutes ago",
    status: "Completed",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Lecturer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Uploaded course materials",
    time: "1 hour ago",
    status: "Completed",
  },
  {
    id: 3,
    user: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Student",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Submitted assignment",
    time: "2 hours ago",
    status: "Completed",
  },
  {
    id: 4,
    user: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Staff",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Processing student applications",
    time: "3 hours ago",
    status: "In Progress",
  },
  {
    id: 5,
    user: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      role: "Lecturer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Grading assignments",
    time: "5 hours ago",
    status: "In Progress",
  },
]
