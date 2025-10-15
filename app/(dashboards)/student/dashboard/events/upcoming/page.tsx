import { Clock, MapPin, User, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

export default function UpcomingEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <p className="text-gray-500">View and manage your upcoming academic events</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Event Types</option>
              <option value="exam">Exams</option>
              <option value="assignment">Assignments</option>
              <option value="meeting">Meetings</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="past">Past Events</option>
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

      {/* Calendar View */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-medium">May 2025</h2>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">Month</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-50">Week</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-50">Day</button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center border-b">
          <div className="py-2 font-medium text-gray-500">Sun</div>
          <div className="py-2 font-medium text-gray-500">Mon</div>
          <div className="py-2 font-medium text-gray-500">Tue</div>
          <div className="py-2 font-medium text-gray-500">Wed</div>
          <div className="py-2 font-medium text-gray-500">Thu</div>
          <div className="py-2 font-medium text-gray-500">Fri</div>
          <div className="py-2 font-medium text-gray-500">Sat</div>
        </div>

        <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y">
          {generateCalendarDays().map((day, index) => (
            <div key={index} className="min-h-[100px] p-2 relative">
              <div className={`text-sm ${day.isCurrentMonth ? "font-medium" : "text-gray-400"}`}>{day.date}</div>
              {day.events.map((event, eventIndex) => (
                <div key={eventIndex} className={`mt-1 p-1 text-xs rounded text-white truncate ${event.color}`}>
                  {event.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Upcoming Events</h2>
        </div>

        <div className="divide-y">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 text-center">
                  <div className={`${event.bgColor} rounded-t-md py-1`}>
                    <span className="text-xs font-medium text-white">{event.month}</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-md py-1 border-t-0">
                    <span className="text-lg font-bold">{event.day}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${event.statusColor}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{event.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
            <span className="font-medium">12</span> events
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
    </div>
  )
}

function generateCalendarDays() {
  // This is a simplified function to generate calendar days for May 2025
  const days = []

  // Week 1 (Apr 27 - May 3)
  days.push({ date: 27, isCurrentMonth: false, events: [] })
  days.push({ date: 28, isCurrentMonth: false, events: [] })
  days.push({ date: 29, isCurrentMonth: false, events: [] })
  days.push({ date: 30, isCurrentMonth: false, events: [] })
  days.push({ date: 1, isCurrentMonth: true, events: [] })
  days.push({ date: 2, isCurrentMonth: true, events: [] })
  days.push({ date: 3, isCurrentMonth: true, events: [] })

  // Week 2 (May 4 - 10)
  days.push({ date: 4, isCurrentMonth: true, events: [] })
  days.push({ date: 5, isCurrentMonth: true, events: [] })
  days.push({ date: 6, isCurrentMonth: true, events: [] })
  days.push({ date: 7, isCurrentMonth: true, events: [] })
  days.push({ date: 8, isCurrentMonth: true, events: [] })
  days.push({ date: 9, isCurrentMonth: true, events: [] })
  days.push({ date: 10, isCurrentMonth: true, events: [] })

  // Week 3 (May 11 - 17)
  days.push({ date: 11, isCurrentMonth: true, events: [] })
  days.push({ date: 12, isCurrentMonth: true, events: [] })
  days.push({ date: 13, isCurrentMonth: true, events: [] })
  days.push({ date: 14, isCurrentMonth: true, events: [] })
  days.push({
    date: 15,
    isCurrentMonth: true,
    events: [{ title: "Mathematics Final Exam", color: "bg-red-500" }],
  })
  days.push({ date: 16, isCurrentMonth: true, events: [] })
  days.push({ date: 17, isCurrentMonth: true, events: [] })

  // Week 4 (May 18 - 24)
  days.push({ date: 18, isCurrentMonth: true, events: [] })
  days.push({
    date: 19,
    isCurrentMonth: true,
    events: [{ title: "Computer Science Project Due", color: "bg-blue-500" }],
  })
  days.push({
    date: 20,
    isCurrentMonth: true,
    events: [{ title: "Student Council Meeting", color: "bg-green-500" }],
  })
  days.push({ date: 21, isCurrentMonth: true, events: [] })
  days.push({ date: 22, isCurrentMonth: true, events: [] })
  days.push({
    date: 23,
    isCurrentMonth: true,
    events: [{ title: "Physics Lab Final", color: "bg-amber-500" }],
  })
  days.push({ date: 24, isCurrentMonth: true, events: [] })

  // Week 5 (May 25 - 31)
  days.push({ date: 25, isCurrentMonth: true, events: [] })
  days.push({ date: 26, isCurrentMonth: true, events: [] })
  days.push({ date: 27, isCurrentMonth: true, events: [] })
  days.push({
    date: 28,
    isCurrentMonth: true,
    events: [{ title: "End of Semester Party", color: "bg-purple-500" }],
  })
  days.push({ date: 29, isCurrentMonth: true, events: [] })
  days.push({ date: 30, isCurrentMonth: true, events: [] })
  days.push({ date: 31, isCurrentMonth: true, events: [] })

  return days
}

const upcomingEvents = [
  {
    id: 1,
    title: "Mathematics Final Exam",
    description: "Comprehensive exam covering all semester topics",
    month: "MAY",
    day: "15",
    time: "10:00 AM - 12:00 PM",
    location: "Main Hall, Building A",
    organizer: "Dr. Robert Chen",
    status: "Important",
    statusColor: "bg-red-100 text-red-800",
    bgColor: "bg-red-500",
  },
  {
    id: 2,
    title: "Computer Science Project Presentation",
    description: "Final project presentation for Introduction to Computer Science",
    month: "MAY",
    day: "19",
    time: "2:30 PM - 4:00 PM",
    location: "Lab 204, Tech Building",
    organizer: "Prof. Maria Garcia",
    status: "Required",
    statusColor: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Student Council Meeting",
    description: "Monthly meeting to discuss campus activities and initiatives",
    month: "MAY",
    day: "20",
    time: "3:00 PM - 4:30 PM",
    location: "Conference Room 101",
    organizer: "Student Council",
    status: "Optional",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-green-500",
  },
  {
    id: 4,
    title: "Physics Lab Final",
    description: "Final lab assessment for Physics 101",
    month: "MAY",
    day: "23",
    time: "9:00 AM - 11:00 AM",
    location: "Lab 105, Science Building",
    organizer: "Dr. James Wilson",
    status: "Required",
    statusColor: "bg-amber-100 text-amber-800",
    bgColor: "bg-amber-500",
  },
  {
    id: 5,
    title: "End of Semester Party",
    description: "Celebration for completing the semester",
    month: "MAY",
    day: "28",
    time: "6:00 PM - 9:00 PM",
    location: "Student Center",
    organizer: "Student Activities Board",
    status: "Social",
    statusColor: "bg-purple-100 text-purple-800",
    bgColor: "bg-purple-500",
  },
]
