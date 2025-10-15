import { Users, Calendar, Clock, MapPin, Plus, MoreVertical } from "lucide-react"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-gray-500">Manage your teaching schedule and classes</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Add Class
        </button>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassCard key={classItem.id} classItem={classItem} />
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Today's Schedule</h2>
        </div>

        <div className="divide-y">
          {todaySchedule.map((schedule) => (
            <div key={schedule.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg ${schedule.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{schedule.subject}</h3>
                      <p className="text-sm text-gray-500">{schedule.class}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${schedule.statusColor}`}>
                      {schedule.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{schedule.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{schedule.students} students</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-600">{schedule.topic}</p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                        View Details
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Classes"
          value="6"
          description="This semester"
          color="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Total Students"
          value="142"
          description="Across all classes"
          color="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Classes Today"
          value="3"
          description="Scheduled for today"
          color="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatCard
          title="Average Attendance"
          value="87%"
          description="Last 30 days"
          color="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>
    </div>
  )
}

function ClassCard({ classItem }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-32 ${classItem.bgColor} flex items-center justify-center`}>
        <Users className="h-12 w-12 text-white" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{classItem.subject}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-2">{classItem.code}</p>
        <p className="text-sm text-gray-600 mb-4">{classItem.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{classItem.students} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{classItem.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{classItem.room}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
            View Class
          </button>
          <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Manage
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, description, color, textColor }) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${color}`}>
      <h3 className="text-xs font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}

const classes = [
  {
    id: 1,
    subject: "Introduction to Computer Science",
    code: "CS101",
    description: "Fundamentals of programming and computer science concepts",
    students: 28,
    schedule: "Mon, Wed, Fri 10:00 AM",
    room: "Room 302, Tech Building",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    subject: "Data Structures",
    code: "CS201",
    description: "Advanced data structures and algorithms",
    students: 24,
    schedule: "Tue, Thu 2:00 PM",
    room: "Room 204, Tech Building",
    bgColor: "bg-purple-500",
  },
  {
    id: 3,
    subject: "Web Development",
    code: "CS301",
    description: "Modern web development technologies and frameworks",
    students: 32,
    schedule: "Mon, Wed 1:00 PM",
    room: "Lab 105, Tech Building",
    bgColor: "bg-green-500",
  },
  {
    id: 4,
    subject: "Database Systems",
    code: "CS401",
    description: "Database design, implementation, and management",
    students: 26,
    schedule: "Tue, Thu 11:00 AM",
    room: "Room 301, Tech Building",
    bgColor: "bg-amber-500",
  },
  {
    id: 5,
    subject: "Software Engineering",
    code: "CS501",
    description: "Software development lifecycle and project management",
    students: 22,
    schedule: "Wed, Fri 3:00 PM",
    room: "Room 401, Tech Building",
    bgColor: "bg-red-500",
  },
  {
    id: 6,
    subject: "Machine Learning",
    code: "CS601",
    description: "Introduction to machine learning algorithms and applications",
    students: 18,
    schedule: "Mon, Thu 4:00 PM",
    room: "Lab 201, Tech Building",
    bgColor: "bg-indigo-500",
  },
]

const todaySchedule = [
  {
    id: 1,
    subject: "Introduction to Computer Science",
    class: "CS101 - Section A",
    time: "10:00 AM - 11:30 AM",
    room: "Room 302",
    students: 28,
    topic: "Introduction to Programming Concepts",
    status: "Upcoming",
    statusColor: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    subject: "Web Development",
    class: "CS301 - Section B",
    time: "1:00 PM - 2:30 PM",
    room: "Lab 105",
    students: 32,
    topic: "React Components and State Management",
    status: "In Progress",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    subject: "Software Engineering",
    class: "CS501 - Section A",
    time: "3:00 PM - 4:30 PM",
    room: "Room 401",
    students: 22,
    topic: "Agile Development Methodologies",
    status: "Scheduled",
    statusColor: "bg-gray-100 text-gray-800",
    bgColor: "bg-red-500",
  },
]
