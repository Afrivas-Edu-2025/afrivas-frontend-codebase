import { Users, Calendar, CheckCircle, XCircle, Clock, Filter, Search } from "lucide-react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Track and manage student attendance</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">Take Attendance</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="OVERALL ATTENDANCE"
          value="87.5%"
          description="This semester"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          color="bg-blue-50"
        />
        <SummaryCard
          title="PRESENT TODAY"
          value="142"
          description="Out of 156 students"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="bg-green-50"
        />
        <SummaryCard
          title="ABSENT TODAY"
          value="14"
          description="9% absence rate"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          color="bg-red-50"
        />
        <SummaryCard
          title="LATE ARRIVALS"
          value="8"
          description="Today's count"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          color="bg-amber-50"
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
                placeholder="Search students..."
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
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
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

      {/* Today's Attendance */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Today's Attendance</h2>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">May 23, 2025</span>
          </div>
        </div>

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
                  Class
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
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
                  Notes
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
              {todayAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{record.student.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.student.name}</div>
                        <div className="text-sm text-gray-500">{record.student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                    >
                      {getStatusIcon(record.status)}
                      <span className="ml-1">{record.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Class Attendance Rates</h2>
          </div>
          <div className="p-4">
            {classAttendanceRates.map((classData) => (
              <div key={classData.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{classData.name}</span>
                  <span className="text-sm text-gray-500">{classData.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getAttendanceColor(classData.rate)}`}
                    style={{ width: `${classData.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Attendance Trends</h2>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Attendance chart visualization</p>
                <p className="text-xs text-gray-400">Weekly attendance trends</p>
              </div>
            </div>
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

function getStatusColor(status) {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-800"
    case "Absent":
      return "bg-red-100 text-red-800"
    case "Late":
      return "bg-amber-100 text-amber-800"
    case "Excused":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "Present":
      return <CheckCircle className="h-3 w-3" />
    case "Absent":
      return <XCircle className="h-3 w-3" />
    case "Late":
      return <Clock className="h-3 w-3" />
    case "Excused":
      return <CheckCircle className="h-3 w-3" />
    default:
      return null
  }
}

function getAttendanceColor(rate) {
  if (rate >= 90) return "bg-green-500"
  if (rate >= 80) return "bg-blue-500"
  if (rate >= 70) return "bg-amber-500"
  return "bg-red-500"
}

const todayAttendance = [
  {
    id: 1,
    student: { name: "John Smith", id: "CS2023001" },
    class: "CS101 - Intro to CS",
    time: "10:00 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 2,
    student: { name: "Sarah Johnson", id: "CS2023002" },
    class: "CS101 - Intro to CS",
    time: "10:00 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 3,
    student: { name: "Mike Davis", id: "CS2023003" },
    class: "CS101 - Intro to CS",
    time: "10:00 AM",
    status: "Late",
    notes: "Arrived 15 minutes late",
  },
  {
    id: 4,
    student: { name: "Emily Brown", id: "CS2023004" },
    class: "CS201 - Data Structures",
    time: "2:00 PM",
    status: "Absent",
    notes: "Medical appointment",
  },
  {
    id: 5,
    student: { name: "Alex Wilson", id: "CS2023005" },
    class: "CS201 - Data Structures",
    time: "2:00 PM",
    status: "Present",
    notes: "",
  },
]

const classAttendanceRates = [
  { id: 1, name: "CS101 - Intro to Computer Science", rate: 92 },
  { id: 2, name: "CS201 - Data Structures", rate: 88 },
  { id: 3, name: "CS301 - Web Development", rate: 85 },
  { id: 4, name: "CS401 - Database Systems", rate: 90 },
  { id: 5, name: "CS501 - Software Engineering", rate: 87 },
]
