'use client'

import { Clock, MapPin, User, Search, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function UpcomingEventsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Event Horizon
            </span>
          </div>
          <TextGenerateEffect
            words="Upcoming Events"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">View and manage your upcoming academic events</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
          <CalendarIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Add Perspective
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-100 transition-colors" size={16} />
              <Input
                placeholder="Search events..."
                className="pl-10 h-11 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700 focus:ring-primary-100 font-medium"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <select className="w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer">
                <option value="all">All Event Types</option>
                <option value="exam">Exams</option>
                <option value="assignment">Assignments</option>
                <option value="meeting">Meetings</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select className="w-full h-11 px-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer">
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            <Button variant="outline" className="h-11 rounded-xl border-white/40 dark:border-slate-700 px-6 font-bold uppercase tracking-widest text-xs hover:bg-primary-100 hover:text-white hover:border-primary-100 transition-all">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between bg-white/10 dark:bg-slate-900/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/20 dark:bg-slate-800/50 rounded-xl p-1 border border-white/20">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/30">
                  <ChevronLeft size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/30">
                  <ChevronRight size={18} />
                </Button>
              </div>
              <h2 className="text-xl font-black tracking-tight text-primary-100">May 2025</h2>
            </div>

            <div className="flex items-center bg-white/20 dark:bg-slate-800/50 rounded-xl p-1 border border-white/20">
              {['Month', 'Week', 'Day'].map((view) => (
                <Button
                  key={view}
                  variant="ghost"
                  className={cn(
                    "px-4 py-1.5 h-auto text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    view === 'Month' ? "bg-primary-100 text-white shadow-neon-primary" : "text-muted-foreground hover:bg-white/20"
                  )}
                >
                  {view}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="px-2 py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y divide-white/10 dark:divide-slate-800/50">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[110px] p-2 relative transition-colors duration-300 group",
                    day.isCurrentMonth ? "bg-transparent" : "bg-gray-50/10 dark:bg-slate-900/20 opacity-40"
                  )}
                >
                  <div className={cn(
                    "text-xs font-bold mb-2 flex items-center justify-center w-6 h-6 rounded-lg transition-all",
                    day.isToday ? "bg-primary-100 text-white shadow-neon-primary scale-110" : "text-muted-foreground group-hover:text-primary-100"
                  )}>
                    {day.date}
                  </div>
                  <div className="space-y-1">
                    {day.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={cn(
                          "px-1.5 py-1 text-[9px] font-bold rounded-md shadow-sm border border-white/20 backdrop-blur-sm truncate cursor-pointer transition-transform hover:scale-105 active:scale-95 text-white",
                          event.color
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <div className="space-y-6">
          <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-full">
            <CardHeader className="p-5 border-b border-white/10 bg-white/10 dark:bg-slate-900/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary-100 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Featured Events
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto max-h-[700px] scrollbar-thin">
              <div className="divide-y divide-white/5 dark:divide-slate-800/50">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-5 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-14 flex-shrink-0 text-center scale-95 group-hover:scale-100 transition-transform">
                        <div className={cn("rounded-t-xl py-1 text-[10px] font-black text-white shadow-sm", event.bgColor)}>
                          {event.month}
                        </div>
                        <div className="bg-white/80 dark:bg-slate-900/80 border border-white/20 border-t-0 rounded-b-xl py-2 shadow-inner">
                          <span className="text-xl font-black text-gray-900 dark:text-white">{event.day}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-black text-gray-900 dark:text-white truncate leading-tight group-hover:text-primary-100 transition-colors">{event.title}</h3>
                          <Badge variant="glass" className={cn("py-0 px-2 h-5 text-[9px] font-bold uppercase", event.statusColor)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground mt-1 line-clamp-1">{event.description}</p>

                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Clock className="w-3.5 h-3.5 text-primary-100" />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <MapPin className="w-3.5 h-3.5 text-primary-100" />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-4 border-t border-white/10 dark:border-slate-800 bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Page 1 of 3</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-white/20 hover:bg-white/20">
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-white/20 hover:bg-white/20">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Featured Highlight Card */}
          <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-neon-primary text-white overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Sparkles size={120} />
            </div>
            <CardContent className="p-6">
              <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-[9px] font-black uppercase mb-4">Must Attend</Badge>
              <h3 className="text-xl font-black mb-2 leading-tight">Annual Tech Symposium 2025</h3>
              <p className="text-xs font-medium text-white/80 leading-relaxed mb-4">Multiple parallel sessions across 4 tracks. Keynote by industry leaders.</p>
              <Button variant="outline" className="w-full rounded-xl bg-white/10 border-white/30 hover:bg-white/20 text-white font-bold h-11 uppercase tracking-widest text-xs">
                Register Participation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function generateCalendarDays() {
  const days = []
  const today = 23 // Faking today to be 23 for consistency with design

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
    events: [{ title: "Math Final", color: "bg-red-500" }],
  })
  days.push({ date: 16, isCurrentMonth: true, events: [] })
  days.push({ date: 17, isCurrentMonth: true, events: [] })

  // Week 4 (May 18 - 24)
  days.push({ date: 18, isCurrentMonth: true, events: [] })
  days.push({
    date: 19,
    isCurrentMonth: true,
    events: [{ title: "CS Project", color: "bg-blue-500" }],
  })
  days.push({
    date: 20,
    isCurrentMonth: true,
    events: [{ title: "Council Meet", color: "bg-green-500" }],
  })
  days.push({ date: 21, isCurrentMonth: true, events: [] })
  days.push({ date: 22, isCurrentMonth: true, events: [] })
  days.push({
    date: 23,
    isCurrentMonth: true,
    isToday: true,
    events: [{ title: "Lab Final", color: "bg-amber-500 shadow-neon-amber" }],
  })
  days.push({ date: 24, isCurrentMonth: true, events: [] })

  // Week 5 (May 25 - 31)
  days.push({ date: 25, isCurrentMonth: true, events: [] })
  days.push({ date: 26, isCurrentMonth: true, events: [] })
  days.push({ date: 27, isCurrentMonth: true, events: [] })
  days.push({
    date: 28,
    isCurrentMonth: true,
    events: [{ title: "Party!", color: "bg-purple-500" }],
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
    description: "Comprehensive exam covering all semester topics.",
    month: "MAY",
    day: "15",
    time: "10:00 AM - 12:00 PM",
    location: "Main Hall, Building A",
    organizer: "Dr. Robert Chen",
    status: "Priority",
    statusColor: "bg-red-500/10 text-red-500 border-red-500/20",
    bgColor: "bg-red-500",
  },
  {
    id: 2,
    title: "CS Project Presentation",
    description: "Final presentation for Intro to Computer Science.",
    month: "MAY",
    day: "19",
    time: "2:30 PM - 4:00 PM",
    location: "Lab 204, Tech Building",
    organizer: "Prof. Maria Garcia",
    status: "Required",
    statusColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    bgColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Student Council Meeting",
    description: "Monthly meeting to discuss campus activities.",
    month: "MAY",
    day: "20",
    time: "3:00 PM - 4:30 PM",
    location: "Conference Room 101",
    organizer: "Student Council",
    status: "Optional",
    statusColor: "bg-green-500/10 text-green-500 border-green-500/20",
    bgColor: "bg-green-500",
  },
  {
    id: 4,
    title: "Physics Lab Final",
    description: "Final lab assessment for Physics 101.",
    month: "MAY",
    day: "23",
    time: "9:00 AM - 11:00 AM",
    location: "Lab 105, Science Building",
    organizer: "Dr. James Wilson",
    status: "Assessment",
    statusColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    bgColor: "bg-amber-500",
  },
  {
    id: 5,
    title: "End of Semester Party",
    description: "Celebration for completing the semester.",
    month: "MAY",
    day: "28",
    time: "6:00 PM - 9:00 PM",
    location: "Student Center",
    organizer: "Student Board",
    status: "Social",
    statusColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    bgColor: "bg-purple-500",
  },
]
