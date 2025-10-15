import Image from "next/image"
import Link from "next/link"

export default function SectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sections</h1>
          <p className="text-gray-500">Manage each section and their resources</p>
        </div>
      </div>

      {/* Section Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/sections/faculty" className="block">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
                  >
                    <Image
                      src={`/placeholder.svg?height=64&width=64&text=${i + 1}`}
                      width={64}
                      height={64}
                      alt={`Faculty member ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <h2 className="text-xl font-bold text-center">FACULTY</h2>
            </div>
          </div>
        </Link>

        <Link href="/admin/sections/department" className="block">
          <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                width={300}
                height={200}
                alt="Department illustration"
                className="mb-4"
              />
              <h2 className="text-xl font-bold text-center">DEPARTMENT</h2>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Section Activity */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Section Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const sectionActivities = [
  {
    id: 1,
    section: "Computer Science",
    type: "Department",
    activity: "New course added",
    time: "2 hours ago",
    user: "Admin",
  },
  {
    id: 2,
    section: "Engineering Faculty",
    type: "Faculty",
    activity: "Faculty member added",
    time: "5 hours ago",
    user: "Admin",
  },
  {
    id: 3,
    section: "Business Administration",
    type: "Department",
    activity: "Course schedule updated",
    time: "1 day ago",
    user: "Department Head",
  },
  {
    id: 4,
    section: "Medicine Faculty",
    type: "Faculty",
    activity: "Faculty information updated",
    time: "2 days ago",
    user: "Faculty Admin",
  },
  {
    id: 5,
    section: "Arts and Humanities",
    type: "Department",
    activity: "New student enrolled",
    time: "3 days ago",
    user: "Registrar",
  },
]
