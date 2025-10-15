import { Download } from "lucide-react"

export default function CompletionRatePage() {
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
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Completion Rate
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Course List</button>
          </nav>
        </div>

        {/* Course Completion Rates */}
        <div>
          <h3 className="text-md font-bold mb-2">Course Completion Rates</h3>
          <p className="text-sm text-gray-500 mb-6">Percentage of students who successfully completed each course</p>

          <div className="h-80">
            <CompletionRatesChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function CompletionRatesChart() {
  const courses = [
    { code: "CS101", rate: 92 },
    { code: "CHEM101", rate: 88 },
    { code: "ECON", rate: 50 },
    { code: "MATH", rate: 78 },
    { code: "BIO101", rate: 85 },
    { code: "CYSEC101", rate: 75 },
    { code: "HIST101", rate: 48 },
    { code: "ENGL101", rate: 82 },
  ]

  return (
    <div className="w-full h-full flex items-end justify-between px-4">
      {courses.map((course, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-12 bg-green-500 rounded-t-sm" style={{ height: `${course.rate * 0.7}%` }}></div>
          <span className="mt-2 text-xs">{course.code}</span>
          <span className="text-xs font-medium">{course.rate}%</span>
        </div>
      ))}
    </div>
  )
}
