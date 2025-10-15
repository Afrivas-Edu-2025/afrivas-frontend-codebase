import { Download } from "lucide-react"

export default function FacultyEnrollmentReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faculty</h1>
          <p className="text-gray-500">Manage and analyze faculty data across the institution</p>
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
          Sync Faculty Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Staff Reports</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Performance Analysis
          </button>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
            Enrollment Reports
          </button>
        </nav>
      </div>

      {/* Faculty Enrollment Reports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Faculty Enrollment Reports</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md text-sm flex items-center gap-1">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <h3 className="text-md font-bold mb-4">Student enrollment trends across faculty departments</h3>

        <div className="h-80">
          <EnrollmentTrendsChart />
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
          <span>3000</span>
          <span>2500</span>
          <span>2000</span>
          <span>1500</span>
          <span>1000</span>
          <span>500</span>
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
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-6">
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
          <div className="border-t border-gray-100"></div>
        </div>

        {/* Chart lines */}
        <svg className="absolute inset-0" viewBox="0 0 1200 500" preserveAspectRatio="none">
          {/* Engineering */}
          <path
            d="M0,100 L150,120 L300,150 L450,130 L600,170 L750,150 L900,180 L1050,160"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Law */}
          <path
            d="M0,200 L150,220 L300,240 L450,210 L600,230 L750,220 L900,240 L1050,230"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />

          {/* Medicine */}
          <path
            d="M0,300 L150,320 L300,350 L450,370 L600,350 L750,380 L900,400 L1050,380"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Architecture */}
          <path
            d="M0,350 L150,340 L300,320 L450,350 L600,330 L750,310 L900,330 L1050,320"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-[-50px] left-0 w-full flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Law</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Medicine</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Architecture</span>
          </div>
        </div>
      </div>
    </div>
  )
}
