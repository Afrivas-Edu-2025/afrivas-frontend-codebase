import { Download } from "lucide-react"

export default function CourseAnalyticsPage() {
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
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Enrollment
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Completion Rate</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Course List</button>
          </nav>
        </div>

        {/* Course Enrollment Trends */}
        <div>
          <h3 className="text-md font-bold mb-2">Course Enrollment Trends</h3>
          <p className="text-sm text-gray-500 mb-6">Monthly enrollment trends for the selected departments</p>

          <div className="h-80">
            <EnrollmentTrendsChart />
          </div>
        </div>
      </div>
    </div>
  )
}

function EnrollmentTrendsChart() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-5 border-l border-b">
        {/* Y-axis labels */}
        <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-xs text-gray-500">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4">
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
        </div>

        {/* Chart lines */}
        <svg className="absolute inset-0" viewBox="0 0 1200 500" preserveAspectRatio="none">
          {/* Engineering */}
          <path
            d="M0,100 L100,120 L200,150 L300,200 L400,180 L500,220 L600,240 L700,220 L800,200 L900,220 L1000,250 L1100,230"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Business */}
          <path
            d="M0,200 L100,210 L200,230 L300,250 L400,270 L500,290 L600,280 L700,260 L800,250 L900,270 L1000,290 L1100,280"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />

          {/* Arts */}
          <path
            d="M0,300 L100,320 L200,350 L300,370 L400,350 L500,380 L600,400 L700,380 L800,350 L900,370 L1000,390 L1100,380"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />

          {/* Medicine */}
          <path
            d="M0,350 L100,340 L200,320 L300,350 L400,330 L500,310 L600,330 L700,320 L800,300 L900,320 L1000,340 L1100,330"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-[-50px] left-0 w-full flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Business</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Arts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Medicine</span>
          </div>
        </div>
      </div>
    </div>
  )
}
