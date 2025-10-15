import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendars</h1>
          <p className="text-gray-500">Manage your schedules</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus size={16} />
          Add Schedules
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-md hover:bg-gray-100">
                <ChevronLeft size={20} />
              </button>
              <button className="p-1 rounded-md hover:bg-gray-100">
                <ChevronRight size={20} />
              </button>
              <h2 className="text-lg font-medium">November, 2021</h2>
            </div>
            <div>
              <select className="px-3 py-1 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Month</option>
                <option>Week</option>
                <option>Day</option>
              </select>
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 border-b">
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">SUN</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">MON</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">TUE</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">WED</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">THU</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">FRI</div>
              <div className="px-2 py-3 text-center text-sm font-medium text-gray-500">SAT</div>
            </div>

            <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y">
              {generateCalendarDays().map((day, index) => (
                <div key={index} className="min-h-[100px] p-2 relative">
                  <div className={`text-sm ${day.isCurrentMonth ? "font-medium" : "text-gray-400"}`}>{day.date}</div>
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className={`mt-1 p-1 text-xs rounded text-white ${event.color}`}>
                      {event.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4">Calendar</h3>
            <MiniCalendar />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4">Types</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="task" className="rounded text-blue-500 focus:ring-blue-500" checked />
                <label htmlFor="task" className="text-sm">
                  Task
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="events" className="rounded text-blue-500 focus:ring-blue-500" checked />
                <label htmlFor="events" className="text-sm">
                  Events
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-4">Label</h3>
            <div className="space-y-2">
              <LabelItem color="bg-amber-100 text-amber-800" name="Classes" />
              <LabelItem color="bg-green-100 text-green-800" name="Meetings" />
              <LabelItem color="bg-red-100 text-red-800" name="Practical" />
              <LabelItem color="bg-blue-100 text-blue-800" name="Test Grading" />
              <LabelItem color="bg-pink-100 text-pink-800" name="Missed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniCalendar() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const dates = [
    [31, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
  ]

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-2">
        <button className="p-1 rounded-md hover:bg-gray-100">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">Nov 2021</span>
        <button className="p-1 rounded-md hover:bg-gray-100">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
      {dates.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((date, j) => {
            const isCurrentMonth = !(i === 0 && date > 7) && !(i >= 4 && date < 15)
            const isToday = date === 10 && i === 1

            return (
              <div
                key={`${i}-${j}`}
                className={`text-center p-1 text-xs rounded-sm
                  ${isCurrentMonth ? "" : "text-gray-300"}
                  ${isToday ? "bg-blue-600 text-white" : ""}
                `}
              >
                {date}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function LabelItem({ color, name }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color.split(" ")[0]}`}></div>
        <span className="text-sm">{name}</span>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}

function generateCalendarDays() {
  // This is a simplified function to generate calendar days for November 2021
  const days = []

  // Week 1 (Oct 31 - Nov 6)
  days.push({ date: 31, isCurrentMonth: false, events: [] })
  days.push({ date: 1, isCurrentMonth: true, events: [] })
  days.push({ date: 2, isCurrentMonth: true, events: [] })
  days.push({ date: 3, isCurrentMonth: true, events: [] })
  days.push({ date: 4, isCurrentMonth: true, events: [] })
  days.push({ date: 5, isCurrentMonth: true, events: [] })
  days.push({ date: 6, isCurrentMonth: true, events: [] })

  // Week 2 (Nov 7 - 13)
  days.push({ date: 7, isCurrentMonth: true, events: [] })
  days.push({ date: 8, isCurrentMonth: true, events: [] })
  days.push({ date: 9, isCurrentMonth: true, events: [] })
  days.push({ date: 10, isCurrentMonth: true, events: [] })
  days.push({ date: 11, isCurrentMonth: true, events: [] })
  days.push({ date: 12, isCurrentMonth: true, events: [] })
  days.push({ date: 13, isCurrentMonth: true, events: [] })

  // Week 3 (Nov 14 - 20)
  days.push({ date: 14, isCurrentMonth: true, events: [] })
  days.push({ date: 15, isCurrentMonth: true, events: [] })
  days.push({ date: 16, isCurrentMonth: true, events: [] })
  days.push({
    date: 17,
    isCurrentMonth: true,
    events: [{ title: "HCI Presentations for Sem 1, 2 & 4", color: "bg-blue-500" }],
  })
  days.push({
    date: 18,
    isCurrentMonth: true,
    events: [{ title: "Submission Deadline", color: "bg-amber-700" }],
  })
  days.push({
    date: 19,
    isCurrentMonth: true,
    events: [{ title: "Practical", color: "bg-green-600" }],
  })
  days.push({ date: 20, isCurrentMonth: true, events: [] })

  // Week 4 (Nov 21 - 27)
  days.push({ date: 21, isCurrentMonth: true, events: [] })
  days.push({
    date: 22,
    isCurrentMonth: true,
    events: [{ title: "Printing Card", color: "bg-amber-500" }],
  })
  days.push({ date: 23, isCurrentMonth: true, events: [] })
  days.push({
    date: 24,
    isCurrentMonth: true,
    events: [{ title: "Revision Class", color: "bg-blue-400" }],
  })
  days.push({ date: 25, isCurrentMonth: true, events: [] })
  days.push({
    date: 26,
    isCurrentMonth: true,
    events: [{ title: "One to one meeting with", color: "bg-pink-500" }],
  })
  days.push({ date: 27, isCurrentMonth: true, events: [] })

  // Week 5 (Nov 28 - Dec 4)
  days.push({ date: 28, isCurrentMonth: true, events: [] })
  days.push({ date: 29, isCurrentMonth: true, events: [] })
  days.push({ date: 30, isCurrentMonth: true, events: [] })
  days.push({ date: 1, isCurrentMonth: false, events: [] })
  days.push({ date: 2, isCurrentMonth: false, events: [] })
  days.push({ date: 3, isCurrentMonth: false, events: [] })
  days.push({ date: 4, isCurrentMonth: false, events: [] })

  return days
}
