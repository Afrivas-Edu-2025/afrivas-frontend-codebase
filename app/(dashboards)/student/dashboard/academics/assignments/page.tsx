import {
  Filter,
  Search,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-gray-500">Track and manage your course assignments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="TOTAL ASSIGNMENTS"
          value="24"
          description="This semester"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          color="bg-blue-50"
        />
        <SummaryCard
          title="COMPLETED"
          value="18"
          description="75% completion rate"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="bg-green-50"
        />
        <SummaryCard
          title="PENDING"
          value="4"
          description="Due this week"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          color="bg-amber-50"
        />
        <SummaryCard
          title="OVERDUE"
          value="2"
          description="Needs immediate attention"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          color="bg-red-50"
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
              <option value="all">All Courses</option>
              <option value="math">Mathematics</option>
              <option value="cs">Computer Science</option>
              <option value="physics">Physics</option>
              <option value="english">English</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
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

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Upcoming Assignments</h2>
        </div>

        <div className="divide-y">
          {upcomingAssignments.map((assignment) => (
            <div key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${assignment.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  {assignment.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">{assignment.course}</p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Assigned: {assignment.assignedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Points: {assignment.points}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[200px]">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: assignment.progress }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{assignment.progress}</span>
                    </div>
                    <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Assignments */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Completed Assignments</h2>
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
                  Submitted
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assignment.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assignment.submittedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{assignment.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assignment.statusColor}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
            <span className="font-medium">18</span> assignments
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">3</button>
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, description, icon, color }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}

const upcomingAssignments = [
  {
    id: 1,
    title: "Linear Algebra Problem Set",
    course: "Mathematics",
    assignedDate: "May 5, 2025",
    dueDate: "May 15, 2025",
    points: "100",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-800",
    progress: "60%",
    bgColor: "bg-blue-100",
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    title: "Algorithm Design Challenge",
    course: "Computer Science",
    assignedDate: "May 8, 2025",
    dueDate: "May 18, 2025",
    points: "150",
    status: "Not Started",
    statusColor: "bg-gray-100 text-gray-800",
    progress: "0%",
    bgColor: "bg-purple-100",
    icon: <Calendar className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 3,
    title: "Physics Lab Report",
    course: "Physics",
    assignedDate: "May 1, 2025",
    dueDate: "May 12, 2025",
    points: "75",
    status: "Due Soon",
    statusColor: "bg-amber-100 text-amber-800",
    progress: "80%",
    bgColor: "bg-amber-100",
    icon: <Calendar className="h-5 w-5 text-amber-500" />,
  },
  {
    id: 4,
    title: "Literary Analysis Essay",
    course: "English Literature",
    assignedDate: "April 25, 2025",
    dueDate: "May 10, 2025",
    points: "100",
    status: "Overdue",
    statusColor: "bg-red-100 text-red-800",
    progress: "50%",
    bgColor: "bg-red-100",
    icon: <Calendar className="h-5 w-5 text-red-500" />,
  },
]

const completedAssignments = [
  {
    id: 1,
    title: "Calculus Problem Set",
    course: "Mathematics",
    dueDate: "April 28, 2025",
    submittedDate: "April 27, 2025",
    grade: "92/100",
    status: "Graded",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    title: "Data Structures Analysis",
    course: "Computer Science",
    dueDate: "April 25, 2025",
    submittedDate: "April 24, 2025",
    grade: "88/100",
    status: "Graded",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    title: "Mechanics Lab Report",
    course: "Physics",
    dueDate: "April 20, 2025",
    submittedDate: "April 19, 2025",
    grade: "95/100",
    status: "Graded",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "Shakespeare Analysis",
    course: "English Literature",
    dueDate: "April 15, 2025",
    submittedDate: "April 15, 2025",
    grade: "85/100",
    status: "Graded",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 5,
    title: "Programming Quiz",
    course: "Computer Science",
    dueDate: "April 10, 2025",
    submittedDate: "April 10, 2025",
    grade: "90/100",
    status: "Graded",
    statusColor: "bg-green-100 text-green-800",
  },
]
