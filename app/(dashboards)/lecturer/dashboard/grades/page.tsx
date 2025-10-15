import { Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Grades</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">Add Class</button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Student Name or ID"
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option value="">Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="relative">
            <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option value="">Class/Subject</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
              Apply Filters
            </button>
            <button className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div>
        <h2 className="text-sm font-medium mb-4">Gradebook Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avatar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Class
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  GPA
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Percentage
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {student.avatar}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gpa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.percentage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">20</span> students
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  4
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  5
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const students = [
  {
    id: "SL-8470",
    avatar: "👨‍🎓",
    name: "Aaron Wilson",
    class: "Mathematics",
    gpa: "3.54",
    grade: "A-",
    percentage: "90.4%",
  },
  {
    id: "SL-8471",
    avatar: "👩‍🎓",
    name: "Ruth G. Henry",
    class: "Mathematics",
    gpa: "3.85",
    grade: "B+",
    percentage: "87.1%",
  },
  {
    id: "SL-8472",
    avatar: "👨‍🎓",
    name: "Gary Peterson",
    class: "Mathematics",
    gpa: "3.75",
    grade: "B+",
    percentage: "85.0%",
  },
  {
    id: "SL-8473",
    avatar: "👩‍🎓",
    name: "Sarah Tang",
    class: "Mathematics",
    gpa: "3.24",
    grade: "B",
    percentage: "83.2%",
  },
  {
    id: "SL-8474",
    avatar: "👨‍🎓",
    name: "Lewis Chen",
    class: "Mathematics",
    gpa: "3.92",
    grade: "A",
    percentage: "92.0%",
  },
]
