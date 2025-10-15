import { Search, Download } from "lucide-react"

export default function CourseListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academics</h1>
          <p className="text-gray-500">Manage all academic activities</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <path d="M16 5h6v6" />
            <path d="M8 21v-4a4 4 0 0 1 4-4h9" />
          </svg>
          Sync Academic Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            Course Analytics
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Grade Audits</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">LMS Engagement</button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>All Department</option>
            <option>Engineering</option>
            <option>Business</option>
            <option>Arts</option>
            <option>Sciences</option>
          </select>
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>Current Semester</option>
            <option>Previous Semester</option>
            <option>All Time</option>
          </select>
        </div>
        <button className="px-3 py-2 border rounded-md text-sm flex items-center gap-2">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Course Analytics */}
      <div>
        <h2 className="text-lg font-bold mb-4">Course Analytics</h2>

        {/* Sub Tabs */}
        <div className="border-b mb-6">
          <nav className="flex space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Enrollment</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Completion Rate</button>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Course List
            </button>
          </nav>
        </div>

        {/* Course List */}
        <div>
          <h3 className="text-md font-bold mb-2">Course List</h3>
          <p className="text-sm text-gray-500 mb-6">Detailed information about all courses</p>

          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrollment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.completion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.engagement}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const courses = [
  {
    id: 1,
    name: "Software Engineering",
    code: "CS101",
    department: "BSEM",
    enrollment: "155",
    completion: "85%",
    engagement: "45%",
  },
  {
    id: 2,
    name: "Introduction to Programming",
    code: "CS102",
    department: "BSEM",
    enrollment: "180",
    completion: "78%",
    engagement: "52%",
  },
  {
    id: 3,
    name: "Data Structures and Algorithms",
    code: "CS201",
    department: "BSEM",
    enrollment: "120",
    completion: "72%",
    engagement: "48%",
  },
  {
    id: 4,
    name: "Database Management Systems",
    code: "CS301",
    department: "BSEM",
    enrollment: "95",
    completion: "88%",
    engagement: "56%",
  },
  {
    id: 5,
    name: "Web Development",
    code: "CS401",
    department: "BSEM",
    enrollment: "110",
    completion: "92%",
    engagement: "62%",
  },
]
