import {
  Search,
  Filter,
  FolderOpen,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
  Music,
  Image,
  File,
} from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resources & Notes</h1>
        <p className="text-gray-500">Access course materials and study resources</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
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
              <option value="notes">Notes</option>
              <option value="slides">Slides</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
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

      {/* Resource Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ResourceCategory
          title="Lecture Notes"
          count="42 files"
          icon={<BookOpen className="h-6 w-6 text-blue-500" />}
          color="bg-blue-50"
        />
        <ResourceCategory
          title="Video Lectures"
          count="18 videos"
          icon={<Video className="h-6 w-6 text-purple-500" />}
          color="bg-purple-50"
        />
        <ResourceCategory
          title="Audio Resources"
          count="12 files"
          icon={<Music className="h-6 w-6 text-amber-500" />}
          color="bg-amber-50"
        />
        <ResourceCategory
          title="Practice Materials"
          count="35 files"
          icon={<FileText className="h-6 w-6 text-green-500" />}
          color="bg-green-50"
        />
      </div>

      {/* Recent Resources */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Resources</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
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
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded
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
              {recentResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                        {getFileIcon(resource.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resource.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{resource.uploaded}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <FileText className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
            <span className="font-medium">42</span> resources
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">3</button>
            <button className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Course Folders */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Course Folders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {courseFolders.map((folder) => (
            <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${folder.color} flex items-center justify-center`}>
                  <FolderOpen className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium">{folder.name}</h3>
                  <p className="text-sm text-gray-500">{folder.fileCount} files</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResourceCategory({ title, count, icon, color }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">{icon}</div>
      </div>
      <h3 className="text-lg font-bold mt-4">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{count}</p>
    </div>
  )
}

function getFileIcon(type) {
  switch (type.toLowerCase()) {
    case "pdf":
      return <File className="h-5 w-5 text-red-500" />
    case "ppt":
    case "pptx":
      return <File className="h-5 w-5 text-orange-500" />
    case "doc":
    case "docx":
      return <File className="h-5 w-5 text-blue-500" />
    case "mp4":
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />
    case "mp3":
    case "audio":
      return <Music className="h-5 w-5 text-amber-500" />
    case "jpg":
    case "png":
    case "image":
      return <Image className="h-5 w-5 text-green-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

const recentResources = [
  {
    id: 1,
    name: "Linear Algebra Lecture Notes",
    course: "Mathematics",
    type: "PDF",
    size: "2.5 MB",
    uploaded: "May 10, 2025",
  },
  {
    id: 2,
    name: "Data Structures Tutorial",
    course: "Computer Science",
    type: "Video",
    size: "45 MB",
    uploaded: "May 8, 2025",
  },
  {
    id: 3,
    name: "Physics Lab Manual",
    course: "Physics",
    type: "PDF",
    size: "3.2 MB",
    uploaded: "May 5, 2025",
  },
  {
    id: 4,
    name: "Shakespeare Analysis Slides",
    course: "English Literature",
    type: "PPT",
    size: "5.7 MB",
    uploaded: "May 3, 2025",
  },
  {
    id: 5,
    name: "Algorithm Design Examples",
    course: "Computer Science",
    type: "DOCX",
    size: "1.8 MB",
    uploaded: "May 1, 2025",
  },
]

const courseFolders = [
  {
    id: 1,
    name: "Mathematics",
    fileCount: "15",
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "Computer Science",
    fileCount: "23",
    color: "bg-purple-100",
  },
  {
    id: 3,
    name: "Physics",
    fileCount: "12",
    color: "bg-amber-100",
  },
  {
    id: 4,
    name: "English Literature",
    fileCount: "8",
    color: "bg-green-100",
  },
  {
    id: 5,
    name: "History",
    fileCount: "5",
    color: "bg-red-100",
  },
  {
    id: 6,
    name: "Study Materials",
    fileCount: "19",
    color: "bg-gray-100",
  },
]
