import { BookOpen, Download, Eye, Star, Filter, Search } from "lucide-react"

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Course Models</h1>
        <p className="text-gray-500">Access course materials, syllabi, and learning models</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search models..."
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
              <option value="syllabus">Syllabus</option>
              <option value="curriculum">Curriculum</option>
              <option value="outline">Course Outline</option>
              <option value="guide">Study Guide</option>
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

      {/* Course Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseModels.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {/* Featured Models */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Featured Course Models</h2>
        </div>

        <div className="divide-y">
          {featuredModels.map((model) => (
            <div key={model.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${model.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{model.title}</h3>
                      <p className="text-sm text-gray-500">{model.course}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-yellow-500">
                        <Star className="h-4 w-4" />
                      </button>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${model.statusColor}`}>
                        {model.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{model.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Updated: {model.lastUpdated}</span>
                      <span>Version: {model.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ModelCard({ model }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-32 ${model.bgColor} flex items-center justify-center`}>
        <BookOpen className="h-12 w-12 text-white" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{model.title}</h3>
          <button className="text-gray-400 hover:text-yellow-500">
            <Star className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-2">{model.course}</p>
        <p className="text-sm text-gray-600 mb-4">{model.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{model.type}</span>
          <span>{model.size}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-1">
            <Eye className="h-4 w-4" />
            View
          </button>
          <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center gap-1">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

const courseModels = [
  {
    id: 1,
    title: "CS101 Course Syllabus",
    course: "Introduction to Computer Science",
    description: "Complete syllabus covering programming fundamentals, algorithms, and data structures.",
    type: "Syllabus",
    size: "2.5 MB",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "MATH201 Curriculum Guide",
    course: "Calculus II",
    description: "Comprehensive curriculum guide with learning objectives and assessment criteria.",
    type: "Curriculum",
    size: "1.8 MB",
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    title: "PHYS101 Lab Manual",
    course: "Introduction to Physics",
    description: "Laboratory manual with experiments and safety guidelines.",
    type: "Guide",
    size: "4.2 MB",
    bgColor: "bg-purple-500",
  },
  {
    id: 4,
    title: "ENG201 Course Outline",
    course: "English Literature",
    description: "Detailed course outline with reading list and assignment schedule.",
    type: "Outline",
    size: "1.2 MB",
    bgColor: "bg-amber-500",
  },
  {
    id: 5,
    title: "HIST101 Study Guide",
    course: "World History",
    description: "Study guide with key concepts, timelines, and review questions.",
    type: "Guide",
    size: "3.1 MB",
    bgColor: "bg-red-500",
  },
  {
    id: 6,
    title: "CHEM101 Safety Manual",
    course: "General Chemistry",
    description: "Laboratory safety manual and chemical handling procedures.",
    type: "Manual",
    size: "2.8 MB",
    bgColor: "bg-indigo-500",
  },
]

const featuredModels = [
  {
    id: 1,
    title: "Advanced Programming Syllabus",
    course: "Computer Science",
    description: "Updated syllabus for the advanced programming course including new frameworks and technologies.",
    status: "New",
    statusColor: "bg-green-100 text-green-800",
    lastUpdated: "May 15, 2025",
    version: "v2.1",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Linear Algebra Curriculum",
    course: "Mathematics",
    description: "Comprehensive curriculum covering vector spaces, matrices, and linear transformations.",
    status: "Updated",
    statusColor: "bg-blue-100 text-blue-800",
    lastUpdated: "May 10, 2025",
    version: "v1.5",
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    title: "Modern Literature Course Guide",
    course: "English",
    description: "Course guide featuring contemporary authors and critical analysis techniques.",
    status: "Popular",
    statusColor: "bg-purple-100 text-purple-800",
    lastUpdated: "May 5, 2025",
    version: "v1.3",
    bgColor: "bg-amber-500",
  },
]
