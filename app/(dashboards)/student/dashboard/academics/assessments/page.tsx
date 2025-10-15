import { Calendar, Clock, FileText, Award, TrendingUp, Filter, Search } from "lucide-react"

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assessments</h1>
        <p className="text-gray-500">Track your academic assessments and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="TOTAL ASSESSMENTS"
          value="28"
          description="This semester"
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          color="bg-blue-50"
        />
        <SummaryCard
          title="COMPLETED"
          value="22"
          description="78.6% completion rate"
          icon={<Award className="h-5 w-5 text-green-500" />}
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
          title="AVERAGE SCORE"
          value="87.5%"
          description="Above class average"
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          color="bg-purple-50"
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
                placeholder="Search assessments..."
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
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
              <option value="project">Project</option>
              <option value="presentation">Presentation</option>
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

      {/* Upcoming Assessments */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Upcoming Assessments</h2>
        </div>

        <div className="divide-y">
          {upcomingAssessments.map((assessment) => (
            <div key={assessment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${assessment.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  {assessment.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-gray-500">{assessment.course}</p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${assessment.statusColor}`}
                    >
                      {assessment.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Due: {assessment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Duration: {assessment.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Weight: {assessment.weight}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-600">{assessment.description}</p>
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

      {/* Assessment History */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Assessment History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assessment
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
                  Type
                </th>
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
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessmentHistory.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(assessment.type)}`}
                    >
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{assessment.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(assessment.grade)}`}
                    >
                      {assessment.grade}
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

function getTypeColor(type) {
  switch (type) {
    case "Quiz":
      return "bg-blue-100 text-blue-800"
    case "Test":
      return "bg-purple-100 text-purple-800"
    case "Project":
      return "bg-green-100 text-green-800"
    case "Presentation":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getGradeColor(grade) {
  if (grade.startsWith("A")) return "bg-green-100 text-green-800"
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800"
  if (grade.startsWith("C")) return "bg-amber-100 text-amber-800"
  if (grade.startsWith("D")) return "bg-orange-100 text-orange-800"
  if (grade.startsWith("F")) return "bg-red-100 text-red-800"
  return "bg-gray-100 text-gray-800"
}

const upcomingAssessments = [
  {
    id: 1,
    title: "Midterm Examination",
    course: "Computer Science",
    dueDate: "May 25, 2025",
    duration: "2 hours",
    weight: "30%",
    status: "Upcoming",
    statusColor: "bg-blue-100 text-blue-800",
    description: "Comprehensive exam covering algorithms and data structures",
    bgColor: "bg-purple-100",
    icon: <FileText className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 2,
    title: "Research Project Presentation",
    course: "Mathematics",
    dueDate: "May 28, 2025",
    duration: "15 minutes",
    weight: "25%",
    status: "Preparation",
    statusColor: "bg-amber-100 text-amber-800",
    description: "Present your research findings on linear algebra applications",
    bgColor: "bg-green-100",
    icon: <Award className="h-5 w-5 text-green-500" />,
  },
]

const assessmentHistory = [
  {
    id: 1,
    title: "Quiz 3: Functions and Loops",
    course: "Computer Science",
    type: "Quiz",
    date: "May 10, 2025",
    score: "18/20",
    grade: "A-",
  },
  {
    id: 2,
    title: "Calculus Test 2",
    course: "Mathematics",
    type: "Test",
    date: "May 5, 2025",
    score: "85/100",
    grade: "B+",
  },
  {
    id: 3,
    title: "Lab Report: Motion Analysis",
    course: "Physics",
    type: "Project",
    date: "April 28, 2025",
    score: "92/100",
    grade: "A",
  },
  {
    id: 4,
    title: "Essay: Modern Literature",
    course: "English",
    type: "Project",
    date: "April 20, 2025",
    score: "88/100",
    grade: "B+",
  },
]
