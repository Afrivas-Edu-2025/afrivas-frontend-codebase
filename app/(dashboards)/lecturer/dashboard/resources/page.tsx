import { ChevronLeft, Star, MoreVertical, FileText, File } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Resources</h1>
          <p className="text-gray-500">Manage and view student notes & more</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          + Add Resource
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="File name & ID"
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option value="">Model</option>
              <option value="math">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
            </select>
          </div>
          <div className="relative">
            <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option value="">Department</option>
              <option value="cs">Computer Science</option>
              <option value="eng">Engineering</option>
              <option value="arts">Arts</option>
            </select>
          </div>
          <div className="relative">
            <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option value="">Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md w-full">
            <ChevronLeft size={16} />
            <span>Upload File</span>
          </button>

          <div className="bg-white border rounded-lg p-4">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4 w-full">
              <File size={16} />
              <span>All Files</span>
            </button>

            <div className="space-y-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase">CONNECTED APPS</h3>
              <div className="space-y-2">
                <button className="flex items-center gap-2 text-sm text-gray-700 w-full py-1">
                  <img
                    src="/placeholder.svg?height=20&width=20"
                    width={20}
                    height={20}
                    alt="Google Drive"
                    className="rounded"
                  />
                  <span>Google Drive</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-700 w-full py-1">
                  <img
                    src="/placeholder.svg?height=20&width=20"
                    width={20}
                    height={20}
                    alt="Dropbox"
                    className="rounded"
                  />
                  <span>Dropbox</span>
                </button>
              </div>

              <div className="space-y-2">
                <button className="flex items-center justify-between text-sm text-gray-700 w-full py-1">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Shared Files</span>
                  </div>
                </button>
                <button className="flex items-center justify-between text-sm text-gray-700 w-full py-1">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Recent Files</span>
                  </div>
                </button>
                <button className="flex items-center justify-between text-sm text-gray-700 w-full py-1">
                  <div className="flex items-center gap-2">
                    <Star size={16} />
                    <span>Starred</span>
                  </div>
                </button>
                <button className="flex items-center justify-between text-sm text-gray-700 w-full py-1">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Deleted</span>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Storage</span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "30%" }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">3.71 GB of 15 GB available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">My Files</h2>

              <div className="grid grid-cols-5 gap-4 mt-4">
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-2">
                    <FileImage size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Photos</h3>
                  <p className="text-xs text-gray-500">51 photos</p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-2">
                    <Video size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Video</h3>
                  <p className="text-xs text-gray-500">23 videos</p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-2">
                    <Music size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Audio</h3>
                  <p className="text-xs text-gray-500">5 audio</p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-2">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Documents</h3>
                  <p className="text-xs text-gray-500">96 files</p>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mb-2">
                    <File size={24} />
                  </div>
                  <h3 className="text-sm font-medium">Others</h3>
                  <p className="text-xs text-gray-500">25 files</p>
                </div>
              </div>
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
                      Model, Semester
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button className="text-gray-400 hover:text-yellow-500 mr-2">
                            <Star size={16} className={file.starred ? "text-yellow-500" : ""} />
                          </button>
                          <div className="flex items-center gap-2">
                            <FileIcon type={file.type} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileIcon({ type }) {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FilePdf size={16} className="text-red-500" />
      case "pptx":
      case "ppt":
        return <FilePpt size={16} className="text-orange-500" />
      case "docx":
      case "doc":
        return <FileDoc size={16} className="text-blue-500" />
      case "txt":
        return <FileText size={16} className="text-gray-500" />
      default:
        return <File size={16} className="text-gray-500" />
    }
  }

  return <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">{getIcon()}</div>
}

function FileImage(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="10" cy="13" r="2" />
      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
    </svg>
  )
}

function Video(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}

function Music(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function FilePdf(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </svg>
  )
}

function FilePpt(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function FileDoc(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  )
}

const files = [
  {
    id: 1,
    name: "Designerator",
    type: "PPTX",
    size: "2 MB",
    model: "Notes - Sem 2",
    starred: false,
  },
  {
    id: 2,
    name: "@designerator at twitter",
    type: "PDF",
    size: "6.7 MB",
    model: "Web Dev - Sem 3",
    starred: true,
  },
  {
    id: 3,
    name: "Dribbble, Behance & Portfolio Project List & Details",
    type: "PDF",
    size: "12 MB",
    model: "English - Sem 1",
    starred: false,
  },
  {
    id: 4,
    name: "Templatecookie Logo v1.0",
    type: "DOCX",
    size: "1.2 MB",
    model: "For All",
    starred: true,
  },
  {
    id: 5,
    name: "Templatecookie",
    type: "PPT",
    size: "111.2 KB",
    model: "HMI",
    starred: false,
  },
  {
    id: 6,
    name: "Templatecookie- Themeforest Templates",
    type: "DOCX",
    size: "2.3 MB",
    model: "Sem 7",
    starred: false,
  },
  {
    id: 7,
    name: "Codashshi",
    type: "PPTX",
    size: "3 MB",
    model: "Data Analytics - Sem 5",
    starred: false,
  },
  {
    id: 8,
    name: "Folder name",
    type: "PPTX",
    size: "11.2 MB",
    model: "HCI - Sem 4",
    starred: true,
  },
]
