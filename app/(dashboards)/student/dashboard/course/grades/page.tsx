import { Search, Filter, BarChart3, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grades</h1>
        <p className="text-gray-500">View and track your academic performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="CURRENT GPA"
          value="3.8"
          description="Out of 4.0"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          color="bg-blue-50"
        />
        <SummaryCard
          title="TOTAL CREDITS"
          value="45"
          description="15 credits this semester"
          icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
          color="bg-purple-50"
        />
        <SummaryCard
          title="CLASS RANK"
          value="12/120"
          description="Top 10% of class"
          icon={<BarChart3 className="h-5 w-5 text-green-500" />}
          color="bg-green-50"
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
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="current">Current Semester</option>
              <option value="previous">Previous Semester</option>
              <option value="all">All Semesters</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Grades</option>
              <option value="a">A Grades</option>
              <option value="b">B Grades</option>
              <option value="c">C Grades</option>
              <option value="d">D Grades</option>
              <option value="f">F Grades</option>
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

      {/* Current Semester Grades */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Current Semester Grades</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Credits
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Instructor
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
                  GPA
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
              {currentSemesterGrades.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.credits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getGradeColor(course.grade)}`}>{course.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.gpa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}
                    >
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Grade Distribution</h2>
          <div className="h-64">
            <GradeDistributionChart />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">GPA Trend</h2>
          <div className="h-64">
            <GPATrendChart />
          </div>
        </div>
      </div>

      {/* Academic History */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Academic History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Semester
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Credits
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
                  Cumulative GPA
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Standing
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {academicHistory.map((semester) => (
                <tr key={semester.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{semester.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{semester.credits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{semester.gpa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{semester.cumulativeGPA}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStandingColor(semester.standing)}`}
                    >
                      {semester.standing}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{" "}
            <span className="font-medium">4</span> semesters
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">1</button>
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

function getGradeColor(grade) {
  if (grade.startsWith("A")) return "text-green-600"
  if (grade.startsWith("B")) return "text-blue-600"
  if (grade.startsWith("C")) return "text-amber-600"
  if (grade.startsWith("D")) return "text-orange-600"
  if (grade.startsWith("F")) return "text-red-600"
  return "text-gray-600"
}

function getStatusColor(status) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Pending":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStandingColor(standing) {
  switch (standing) {
    case "Dean's List":
      return "bg-green-100 text-green-800"
    case "Good Standing":
      return "bg-blue-100 text-blue-800"
    case "Academic Warning":
      return "bg-amber-100 text-amber-800"
    case "Academic Probation":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function GradeDistributionChart() {
  const grades = [
    { grade: "A", count: 8 },
    { grade: "B", count: 5 },
    { grade: "C", count: 2 },
    { grade: "D", count: 0 },
    { grade: "F", count: 0 },
  ]

  return (
    <div className="w-full h-full flex items-end justify-around">
      {grades.map((grade, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-16 rounded-t-sm ${getBarColor(grade.grade)}`}
            style={{ height: `${grade.count * 20}px` }}
          ></div>
          <p className="mt-2 font-medium">{grade.grade}</p>
          <p className="text-sm text-gray-500">{grade.count} courses</p>
        </div>
      ))}
    </div>
  )
}

function getBarColor(grade) {
  switch (grade) {
    case "A":
      return "bg-green-500"
    case "B":
      return "bg-blue-500"
    case "C":
      return "bg-amber-500"
    case "D":
      return "bg-orange-500"
    case "F":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function GPATrendChart() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 border-l border-b">
        {/* Y-axis labels */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>4.0</span>
          <span>3.0</span>
          <span>2.0</span>
          <span>1.0</span>
          <span>0.0</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-gray-500">
          <span>Sem 1</span>
          <span>Sem 2</span>
          <span>Sem 3</span>
          <span>Current</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4">
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
        </div>

        {/* Chart line */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,30 L33,25 L66,20 L100,15" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M0,30 L33,25 L66,20 L100,15" fill="url(#blue-gradient)" strokeWidth="0" opacity="0.2" />
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

const currentSemesterGrades = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH 301",
    credits: 3,
    instructor: "Dr. Robert Chen",
    grade: "A",
    gpa: "4.0",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Introduction to Computer Science",
    code: "CS 101",
    credits: 4,
    instructor: "Prof. Maria Garcia",
    grade: "A-",
    gpa: "3.7",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Physics 101",
    code: "PHYS 101",
    credits: 4,
    instructor: "Dr. James Wilson",
    grade: "B+",
    gpa: "3.3",
    status: "In Progress",
  },
  {
    id: 4,
    name: "English Literature",
    code: "ENG 201",
    credits: 3,
    instructor: "Prof. Emily Johnson",
    grade: "A",
    gpa: "4.0",
    status: "In Progress",
  },
  {
    id: 5,
    name: "Introduction to Psychology",
    code: "PSYC 101",
    credits: 3,
    instructor: "Dr. Michael Brown",
    grade: "B",
    gpa: "3.0",
    status: "In Progress",
  },
]

const academicHistory = [
  {
    id: 1,
    name: "Fall 2024",
    credits: 15,
    gpa: "3.8",
    cumulativeGPA: "3.8",
    standing: "Dean's List",
  },
  {
    id: 2,
    name: "Spring 2024",
    credits: 16,
    gpa: "3.6",
    cumulativeGPA: "3.7",
    standing: "Dean's List",
  },
  {
    id: 3,
    name: "Fall 2023",
    credits: 14,
    gpa: "3.5",
    cumulativeGPA: "3.5",
    standing: "Good Standing",
  },
  {
    id: 4,
    name: "Current (Spring 2025)",
    credits: 17,
    gpa: "3.8 (Projected)",
    cumulativeGPA: "3.7",
    standing: "In Progress",
  },
]
