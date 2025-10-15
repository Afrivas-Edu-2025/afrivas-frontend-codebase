import { ArrowUp, BarChart3, Download } from "lucide-react"

export default function AcademicsPage() {
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
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Course Analytics</button>
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

      {/* Academic Performance Overview */}
      <div>
        <h2 className="text-lg font-bold mb-4">Academic Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="TOTAL COURSES"
            value="248"
            change={
              <>
                <ArrowUp className="h-4 w-4 text-green-500" /> 7.5% from last semester
              </>
            }
            icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
          />
          <MetricCard
            title="AVG. ENROLLMENT"
            value="42"
            change={
              <>
                <ArrowUp className="h-4 w-4 text-green-500" /> 3 students per course
              </>
            }
            icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
          />
          <MetricCard
            title="COMPLETION RATE"
            value="88.5%"
            change={
              <>
                <ArrowUp className="h-4 w-4 text-green-500" /> 2.3% from last semester
              </>
            }
            icon={<BarChart3 className="h-5 w-5 text-green-500" />}
          />
          <MetricCard
            title="LMS ENGAGEMENT"
            value="76.2%"
            change={
              <>
                <ArrowUp className="h-4 w-4 text-green-500" /> 1.5% from last semester
              </>
            }
            icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Enrollment</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Completion Rate</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Student Engagement
          </button>
        </nav>
      </div>

      {/* Student Engagement Levels by Department */}
      <div>
        <h2 className="text-lg font-bold mb-4">Student Engagement Levels by Department</h2>
        <p className="text-sm text-gray-500 mb-6">
          Average engagement levels based on LMS activity, attendance, and participation
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="h-64 flex items-center justify-center">
              <EngagementPieChart />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Computer Science (30%): Highest engagement with regular participation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Engineering (25%): Strong engagement especially in practical sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Business Admin (20%): Good engagement with case studies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Arts and Humanities (15%): Moderate engagement in discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Medicine (10%): Focused mostly on practical sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon }) {
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

function EngagementPieChart() {
  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Computer Science - 30% */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray="75.4 125.6"
          strokeDashoffset="0"
        />

        {/* Engineering - 25% */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray="62.8 138.2"
          strokeDashoffset="-75.4"
        />

        {/* Business Admin - 20% */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#f59e0b"
          strokeWidth="20"
          strokeDasharray="50.2 150.8"
          strokeDashoffset="-138.2"
        />

        {/* Arts and Humanities - 15% */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#8b5cf6"
          strokeWidth="20"
          strokeDasharray="37.7 163.3"
          strokeDashoffset="-188.4"
        />

        {/* Medicine - 10% */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#ef4444"
          strokeWidth="20"
          strokeDasharray="25.1 175.9"
          strokeDashoffset="-226.1"
        />
      </svg>
    </div>
  )
}
