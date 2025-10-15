import { FileText, Calendar, Users, Plus, Filter, Search, MoreVertical } from "lucide-react"

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-gray-500">Create and manage student assignments</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Create Assignment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="TOTAL ASSIGNMENTS"
          value="24"
          description="This semester"
          color="bg-blue-50"
          textColor="text-blue-600"
        />
        <SummaryCard
          title="PENDING REVIEW"
          value="8"
          description="Awaiting grading"
          color="bg-amber-50"
          textColor="text-amber-600"
        />
        <SummaryCard title="GRADED" value="16" description="Completed" color="bg-green-50" textColor="text-green-600" />
        <SummaryCard
          title="AVERAGE SCORE"
          value="85.2%"
          description="Class average"
          color="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Classes</option>
              <option value="cs101">CS101 - Intro to CS</option>
              <option value="cs201">CS201 - Data Structures</option>
              <option value="cs301">CS301 - Web Development</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Active Assignments</h2>
        </div>

        <div className="divide-y">
          {activeAssignments.map((assignment) => (
            <div key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${assignment.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">{assignment.course}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}
                      >
                        {assignment.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{assignment.submissions} submissions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{assignment.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">Points: {assignment.points}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((assignment.submissions / assignment.totalStudents) * 100)}% submitted
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                        View Submissions
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md">
                        Grade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Assignments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assignment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submissions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assignment.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {assignment.submissions}/{assignment.totalStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Grade</button>
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

function SummaryCard({ title, value, description, color, textColor }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <h3 className="text-xs font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Closed":
      return "bg-gray-100 text-gray-800"
    case "Draft":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

const activeAssignments = [
  {
    id: 1,
    title: "Programming Assignment 3",
    course: "CS101 - Introduction to Computer Science",
    description: "Implement a basic calculator using object-oriented programming principles",
    dueDate: "May 30, 2025",
    submissions: 18,
    totalStudents: 28,
    points: 100,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Data Structure Implementation",
    course: "CS201 - Data Structures",
    description: "Create and test implementations of stack, queue, and linked list",
    dueDate: "June 5, 2025",
    submissions: 12,
    totalStudents: 24,
    points: 150,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-purple-500",
  },
  {
    id: 3,
    title: "Web Portfolio Project",
    course: "CS301 - Web Development",
    description: "Build a responsive personal portfolio website using modern web technologies",
    dueDate: "June 10, 2025",
    submissions: 8,
    totalStudents: 32,
    points: 200,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-green-500",
  },
]

const recentAssignments = [
  {
    id: 1,
    title: "Algorithm Analysis Report",
    course: "CS201",
    dueDate: "May 15, 2025",
    submissions: 24,
    totalStudents: 24,
    status: "Closed",
  },
  {
    id: 2,
    title: "Database Design Project",
    course: "CS401",
    dueDate: "May 20, 2025",
    submissions: 22,
    totalStudents: 26,
    status: "Closed",
  },
  {
    id: 3,
    title: "Software Testing Lab",
    course: "CS501",
    dueDate: "May 25, 2025",
    submissions: 20,
    totalStudents: 22,
    status: "Active",
  },
]
