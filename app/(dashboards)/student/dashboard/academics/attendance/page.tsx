import { CheckCircle, XCircle, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-gray-500">Track your class attendance and absences</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="PRESENT"
          value="92.5%"
          description="148 days present"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="bg-green-50"
        />
        <SummaryCard
          title="ABSENT"
          value="2%"
          description="3 days absent"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          color="bg-red-50"
        />
        <SummaryCard
          title="EXCUSED"
          value="5.5%"
          description="9 days excused"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          color="bg-amber-50"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Courses</option>
              <option value="math">Mathematics</option>
              <option value="cs">Computer Science</option>
              <option value="physics">Physics</option>
              <option value="english">English</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="current">Current Semester</option>
              <option value="last">Last Semester</option>
              <option value="year">Academic Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
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

      {/* Monthly Calendar */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-medium">May 2025</h2>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm">Excused</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center border-b">
          <div className="py-2 font-medium text-gray-500">Sun</div>
          <div className="py-2 font-medium text-gray-500">Mon</div>
          <div className="py-2 font-medium text-gray-500">Tue</div>
          <div className="py-2 font-medium text-gray-500">Wed</div>
          <div className="py-2 font-medium text-gray-500">Thu</div>
          <div className="py-2 font-medium text-gray-500">Fri</div>
          <div className="py-2 font-medium text-gray-500">Sat</div>
        </div>

        <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y">
          {generateCalendarDays().map((day, index) => (
            <div key={index} className="min-h-[100px] p-2 relative">
              <div className={`text-sm ${day.isCurrentMonth ? "font-medium" : "text-gray-400"}`}>{day.date}</div>
              {day.status && (
                <div className="mt-2 flex justify-center">
                  <div
                    className={`w-8 h-8 rounded-full ${getStatusColor(day.status)} flex items-center justify-center`}
                  >
                    {getStatusIcon(day.status)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Attendance Records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
            <span className="font-medium">20</span> records
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">2</button>
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

function getStatusColor(status) {
  switch (status) {
    case "present":
      return "bg-green-100"
    case "absent":
      return "bg-red-100"
    case "excused":
      return "bg-amber-100"
    default:
      return ""
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "present":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "absent":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "excused":
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    default:
      return null
  }
}

function getStatusBadgeColor(status) {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-800"
    case "Absent":
      return "bg-red-100 text-red-800"
    case "Excused":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function generateCalendarDays() {
  // This is a simplified function to generate calendar days for May 2025
  const days = []

  // Week 1 (Apr 27 - May 3)
  days.push({ date: 27, isCurrentMonth: false, status: null })
  days.push({ date: 28, isCurrentMonth: false, status: null })
  days.push({ date: 29, isCurrentMonth: false, status: null })
  days.push({ date: 30, isCurrentMonth: false, status: null })
  days.push({ date: 1, isCurrentMonth: true, status: "present" })
  days.push({ date: 2, isCurrentMonth: true, status: "present" })
  days.push({ date: 3, isCurrentMonth: true, status: null })

  // Week 2 (May 4 - 10)
  days.push({ date: 4, isCurrentMonth: true, status: null })
  days.push({ date: 5, isCurrentMonth: true, status: "present" })
  days.push({ date: 6, isCurrentMonth: true, status: "present" })
  days.push({ date: 7, isCurrentMonth: true, status: "present" })
  days.push({ date: 8, isCurrentMonth: true, status: "present" })
  days.push({ date: 9, isCurrentMonth: true, status: "present" })
  days.push({ date: 10, isCurrentMonth: true, status: null })

  // Week 3 (May 11 - 17)
  days.push({ date: 11, isCurrentMonth: true, status: null })
  days.push({ date: 12, isCurrentMonth: true, status: "present" })
  days.push({ date: 13, isCurrentMonth: true, status: "excused" })
  days.push({ date: 14, isCurrentMonth: true, status: "present" })
  days.push({ date: 15, isCurrentMonth: true, status: "present" })
  days.push({ date: 16, isCurrentMonth: true, status: "present" })
  days.push({ date: 17, isCurrentMonth: true, status: null })

  // Week 4 (May 18 - 24)
  days.push({ date: 18, isCurrentMonth: true, status: null })
  days.push({ date: 19, isCurrentMonth: true, status: "present" })
  days.push({ date: 20, isCurrentMonth: true, status: "present" })
  days.push({ date: 21, isCurrentMonth: true, status: "absent" })
  days.push({ date: 22, isCurrentMonth: true, status: "present" })
  days.push({ date: 23, isCurrentMonth: true, status: "present" })
  days.push({ date: 24, isCurrentMonth: true, status: null })

  // Week 5 (May 25 - 31)
  days.push({ date: 25, isCurrentMonth: true, status: null })
  days.push({ date: 26, isCurrentMonth: true, status: "present" })
  days.push({ date: 27, isCurrentMonth: true, status: "present" })
  days.push({ date: 28, isCurrentMonth: true, status: "present" })
  days.push({ date: 29, isCurrentMonth: true, status: "present" })
  days.push({ date: 30, isCurrentMonth: true, status: "present" })
  days.push({ date: 31, isCurrentMonth: true, status: null })

  return days
}

const attendanceRecords = [
  {
    id: 1,
    date: "May 1, 2025",
    course: "Mathematics",
    time: "10:00 AM - 11:30 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 2,
    date: "May 2, 2025",
    course: "Computer Science",
    time: "1:00 PM - 2:30 PM",
    status: "Present",
    notes: "",
  },
  {
    id: 3,
    date: "May 5, 2025",
    course: "Physics",
    time: "9:00 AM - 10:30 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 4,
    date: "May 6, 2025",
    course: "English Literature",
    time: "11:00 AM - 12:30 PM",
    status: "Present",
    notes: "",
  },
  {
    id: 5,
    date: "May 7, 2025",
    course: "Mathematics",
    time: "10:00 AM - 11:30 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 6,
    date: "May 8, 2025",
    course: "Computer Science",
    time: "1:00 PM - 2:30 PM",
    status: "Present",
    notes: "",
  },
  {
    id: 7,
    date: "May 9, 2025",
    course: "Physics",
    time: "9:00 AM - 10:30 AM",
    status: "Present",
    notes: "",
  },
  {
    id: 8,
    date: "May 12, 2025",
    course: "English Literature",
    time: "11:00 AM - 12:30 PM",
    status: "Present",
    notes: "",
  },
  {
    id: 9,
    date: "May 13, 2025",
    course: "Mathematics",
    time: "10:00 AM - 11:30 AM",
    status: "Excused",
    notes: "Medical appointment",
  },
  {
    id: 10,
    date: "May 14, 2025",
    course: "Computer Science",
    time: "1:00 PM - 2:30 PM",
    status: "Present",
    notes: "",
  },
]
