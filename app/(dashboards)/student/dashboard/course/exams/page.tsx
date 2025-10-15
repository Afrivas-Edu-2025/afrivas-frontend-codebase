import { Calendar, Clock, FileText, MapPin } from "lucide-react"

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-gray-500">View and prepare for your upcoming examinations</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
            <option>All Courses</option>
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
          </select>
          <select className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
            <option>Current Semester</option>
            <option>Previous Semester</option>
          </select>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>

      {/* Past Exams */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Past Exams</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pastExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{exam.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{exam.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{exam.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {exam.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getResultClass(exam.result)}`}
                    >
                      {exam.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Study Resources */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Exam Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamCard({ exam }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-2 ${getExamTypeColor(exam.type)}`}></div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{exam.course}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{exam.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>{exam.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>{exam.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span>{exam.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${getExamTypeClass(exam.type)}`}>{exam.type}</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

function ResourceCard({ resource }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">{resource.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">{resource.type}</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

function getExamTypeColor(type) {
  switch (type) {
    case "Final Exam":
      return "bg-red-500"
    case "Midterm":
      return "bg-amber-500"
    case "Quiz":
      return "bg-green-500"
    default:
      return "bg-blue-500"
  }
}

function getExamTypeClass(type) {
  switch (type) {
    case "Final Exam":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Midterm":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    case "Quiz":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  }
}

function getResultClass(result) {
  if (result.includes("A")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  } else if (result.includes("B")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  } else if (result.includes("C")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
  } else {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }
}

const upcomingExams = [
  {
    id: 1,
    course: "CS301: Data Structures",
    description: "Comprehensive exam covering all topics from the semester",
    date: "June 15, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Room 302, Computer Science Building",
    type: "Final Exam",
  },
  {
    id: 2,
    course: "MATH201: Calculus II",
    description: "Exam covering integration techniques and applications",
    date: "June 10, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Room 105, Mathematics Building",
    type: "Final Exam",
  },
  {
    id: 3,
    course: "PHYS101: Introduction to Physics",
    description: "Quiz on mechanics and motion",
    date: "May 30, 2023",
    time: "11:00 AM - 12:00 PM",
    location: "Room 201, Science Building",
    type: "Quiz",
  },
]

const pastExams = [
  {
    id: 1,
    course: "CS201: Programming Fundamentals",
    date: "April 20, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Room 302, Computer Science Building",
    result: "A+",
  },
  {
    id: 2,
    course: "MATH101: Calculus I",
    date: "April 15, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Room 105, Mathematics Building",
    result: "B+",
  },
  {
    id: 3,
    course: "ENG101: English Composition",
    date: "April 5, 2023",
    time: "9:00 AM - 11:00 AM",
    location: "Room 201, Humanities Building",
    result: "A",
  },
  {
    id: 4,
    course: "HIST101: World History",
    date: "March 25, 2023",
    time: "1:00 PM - 3:00 PM",
    location: "Room 301, Humanities Building",
    result: "B",
  },
]

const examResources = [
  {
    id: 1,
    title: "CS301 Study Guide",
    description: "Comprehensive study guide for the Data Structures final exam",
    type: "PDF Document",
  },
  {
    id: 2,
    title: "MATH201 Practice Problems",
    description: "Collection of practice problems for Calculus II with solutions",
    type: "PDF Document",
  },
  {
    id: 3,
    title: "PHYS101 Formula Sheet",
    description: "Essential formulas and equations for the Physics quiz",
    type: "PDF Document",
  },
]
