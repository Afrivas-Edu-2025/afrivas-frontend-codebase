import { ChevronLeft, ChevronRight, Clock, MapPin, BookOpen, User } from "lucide-react"

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Timetable</h1>
        <p className="text-gray-500">View your weekly class schedule</p>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-lg border p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-medium">May 12 - May 18, 2025</h2>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">Week</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-50">Day</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-50">Month</button>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500 border-r">Time</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Monday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Tuesday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Wednesday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Thursday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Friday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Saturday</div>
          <div className="py-3 px-2 text-center text-sm font-medium text-gray-500">Sunday</div>
        </div>

        <div className="relative">
          {/* Time slots */}
          <div className="grid grid-cols-8 divide-x">
            <div className="divide-y">
              {timeSlots.map((time, index) => (
                <div key={index} className="h-24 p-1 text-xs text-gray-500 text-center">
                  {time}
                </div>
              ))}
            </div>

            {/* Monday to Sunday columns */}
            {[...Array(7)].map((_, dayIndex) => (
              <div key={dayIndex} className="relative divide-y">
                {timeSlots.map((_, timeIndex) => (
                  <div key={timeIndex} className="h-24 p-1"></div>
                ))}

                {/* Classes for this day */}
                {classes
                  .filter((cls) => cls.day === dayIndex)
                  .map((cls) => (
                    <div
                      key={cls.id}
                      className={`absolute p-2 rounded-md ${cls.bgColor} border-l-4 ${cls.borderColor} overflow-hidden`}
                      style={{
                        top: `${(cls.startHour - 8) * 96 + (cls.startMinute / 60) * 96}px`,
                        height: `${(cls.endHour - cls.startHour) * 96 - ((cls.startMinute - cls.endMinute) / 60) * 96}px`,
                        left: "4px",
                        right: "4px",
                      }}
                    >
                      <h3 className="font-medium text-sm truncate">{cls.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{cls.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500 truncate">{cls.location}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Today's Classes</h2>

        <div className="space-y-4">
          {todayClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg ${cls.bgColor} flex items-center justify-center flex-shrink-0`}>
                {cls.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{cls.name}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{cls.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{cls.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{cls.type}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${cls.statusColor}`}>
                  {cls.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

const classes = [
  {
    id: 1,
    name: "Mathematics",
    day: 0, // Monday
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    time: "10:00 AM - 11:30 AM",
    location: "Room 101, Building A",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
  {
    id: 2,
    name: "Computer Science",
    day: 0, // Monday
    startHour: 13,
    startMinute: 0,
    endHour: 14,
    endMinute: 30,
    time: "1:00 PM - 2:30 PM",
    location: "Lab 204, Tech Building",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
  },
  {
    id: 3,
    name: "Physics",
    day: 1, // Tuesday
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 30,
    time: "9:00 AM - 10:30 AM",
    location: "Lab 105, Science Building",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
  },
  {
    id: 4,
    name: "English Literature",
    day: 1, // Tuesday
    startHour: 14,
    startMinute: 0,
    endHour: 15,
    endMinute: 30,
    time: "2:00 PM - 3:30 PM",
    location: "Room 203, Arts Building",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  },
  {
    id: 5,
    name: "Mathematics",
    day: 2, // Wednesday
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    time: "10:00 AM - 11:30 AM",
    location: "Room 101, Building A",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
  {
    id: 6,
    name: "Computer Science",
    day: 2, // Wednesday
    startHour: 13,
    startMinute: 0,
    endHour: 14,
    endMinute: 30,
    time: "1:00 PM - 2:30 PM",
    location: "Lab 204, Tech Building",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
  },
  {
    id: 7,
    name: "Physics",
    day: 3, // Thursday
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 30,
    time: "9:00 AM - 10:30 AM",
    location: "Lab 105, Science Building",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500",
  },
  {
    id: 8,
    name: "English Literature",
    day: 3, // Thursday
    startHour: 14,
    startMinute: 0,
    endHour: 15,
    endMinute: 30,
    time: "2:00 PM - 3:30 PM",
    location: "Room 203, Arts Building",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  },
  {
    id: 9,
    name: "Mathematics",
    day: 4, // Friday
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    time: "10:00 AM - 11:30 AM",
    location: "Room 101, Building A",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
]

const todayClasses = [
  {
    id: 1,
    name: "Mathematics",
    time: "10:00 AM - 11:30 AM",
    location: "Room 101, Building A",
    instructor: "Dr. Robert Chen",
    type: "Lecture",
    status: "Upcoming",
    statusColor: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-100",
    icon: <BookOpen className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    name: "Computer Science",
    time: "1:00 PM - 2:30 PM",
    location: "Lab 204, Tech Building",
    instructor: "Prof. Maria Garcia",
    type: "Lab Session",
    status: "In Progress",
    statusColor: "bg-green-100 text-green-800",
    bgColor: "bg-purple-100",
    icon: <BookOpen className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 3,
    name: "Study Group - Physics",
    time: "3:00 PM - 4:30 PM",
    location: "Library, Study Room 3",
    instructor: "Student-led",
    type: "Group Study",
    status: "Optional",
    statusColor: "bg-gray-100 text-gray-800",
    bgColor: "bg-amber-100",
    icon: <BookOpen className="h-5 w-5 text-amber-500" />,
  },
]
