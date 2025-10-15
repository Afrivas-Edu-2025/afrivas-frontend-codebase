import { ArrowUp, ArrowDown, BarChart3, PieChart, LineChart, TrendingUp } from "lucide-react"

export default function AcademicInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Academic Insights</h1>
        <p className="text-gray-500">View your academic performance and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="CURRENT GPA"
          value="3.8"
          change={
            <>
              <ArrowUp className="h-4 w-4 text-green-500" /> 0.2 from last semester
            </>
          }
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        />
        <SummaryCard
          title="ATTENDANCE RATE"
          value="92.5%"
          change={
            <>
              <ArrowUp className="h-4 w-4 text-green-500" /> 3.2% from last month
            </>
          }
          icon={<BarChart3 className="h-5 w-5 text-green-500" />}
        />
        <SummaryCard
          title="ASSIGNMENT COMPLETION"
          value="85%"
          change={
            <>
              <ArrowDown className="h-4 w-4 text-red-500" /> 2% from last month
            </>
          }
          icon={<PieChart className="h-5 w-5 text-purple-500" />}
        />
        <SummaryCard
          title="CLASS RANK"
          value="12/120"
          change="Top 10% of class"
          icon={<LineChart className="h-5 w-5 text-amber-500" />}
        />
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">GPA Trend</h2>
          <div className="h-64">
            <GPATrendChart />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Subject Performance</h2>
          <div className="h-64">
            <SubjectPerformanceChart />
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Attendance Breakdown</h2>
          <div className="h-64">
            <AttendanceChartComponent />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Assignment Completion</h2>
          <div className="h-64">
            <AssignmentCompletionChartComponent />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Study Time Distribution</h2>
          <div className="h-64">
            <StudyTimeChartComponent />
          </div>
        </div>
      </div>

      {/* Performance by Category */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Performance by Assessment Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <PerformanceCategory title="Exams" score="92%" color="bg-blue-500" />
          <PerformanceCategory title="Assignments" score="85%" color="bg-green-500" />
          <PerformanceCategory title="Projects" score="88%" color="bg-purple-500" />
          <PerformanceCategory title="Quizzes" score="78%" color="bg-amber-500" />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{change}</p>
    </div>
  )
}

function PerformanceCategory({ title, score, color }) {
  const percentage = Number.parseInt(score)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm font-bold">{score}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

// Placeholder chart components
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
          <span>Sem 4</span>
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
          <path d="M0,40 L25,35 L50,30 L75,25 L100,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <path d="M0,40 L25,35 L50,30 L75,25 L100,20" fill="url(#blue-gradient)" strokeWidth="0" opacity="0.2" />
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

function SubjectPerformanceChart() {
  const subjects = [
    { name: "Mathematics", score: 92 },
    { name: "Computer Science", score: 88 },
    { name: "Physics", score: 76 },
    { name: "English", score: 85 },
    { name: "History", score: 79 },
  ]

  return (
    <div className="w-full h-full">
      <div className="h-full flex items-end">
        {subjects.map((subject, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-12 bg-blue-500 rounded-t-sm" style={{ height: `${subject.score * 0.6}%` }}></div>
            <p className="text-xs mt-2 text-gray-500 truncate w-full text-center">{subject.name}</p>
            <p className="text-xs font-bold">{subject.score}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttendanceChartComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#10b981"
            strokeWidth="15"
            strokeDasharray="251.2"
            strokeDashoffset="18.8"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">92.5%</span>
          <span className="text-sm text-gray-500">Attendance</span>
        </div>
      </div>

      <div className="ml-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">Present: 92.5%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-sm">Excused: 5.5%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Absent: 2%</span>
        </div>
      </div>
    </div>
  )
}

function AssignmentCompletionChartComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="15"
            strokeDasharray="251.2"
            strokeDashoffset="37.7"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">85%</span>
          <span className="text-sm text-gray-500">Completed</span>
        </div>
      </div>

      <div className="ml-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm">Completed: 85%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-sm">In Progress: 10%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Late: 5%</span>
        </div>
      </div>
    </div>
  )
}

function StudyTimeChartComponent() {
  const subjects = [
    { name: "Mathematics", hours: 12, color: "bg-blue-500" },
    { name: "Computer Science", hours: 15, color: "bg-purple-500" },
    { name: "Physics", hours: 8, color: "bg-amber-500" },
    { name: "English", hours: 6, color: "bg-green-500" },
    { name: "History", hours: 5, color: "bg-red-500" },
  ]

  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0)

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {subjects.map((subject, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{subject.name}</span>
            <span className="text-sm font-medium">{subject.hours} hrs</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${subject.color}`}
              style={{ width: `${(subject.hours / totalHours) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
