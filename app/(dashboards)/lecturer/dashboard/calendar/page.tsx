'use client'

import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, Calendar as CalendarIcon, Filter, Layers, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function LecturerCalendarPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" />
              Lecturer Schedule
            </span>
          </div>
          <TextGenerateEffect
            words="Academic Timetable"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Manage your lectures, meetings, and grading deadlines</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/10 dark:border-slate-800/50 flex flex-row items-center justify-between bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/20 dark:bg-slate-800/50 rounded-xl p-1 border border-white/20">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/30">
                    <ChevronLeft size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/30">
                    <ChevronRight size={18} />
                  </Button>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-primary-100">November 2021</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="glass" className="px-3 py-1 font-bold">Today: Nov 10</Badge>
                <select className="bg-white/50 dark:bg-slate-800 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer font-bold">
                  <option>Month View</option>
                  <option>Week View</option>
                  <option>Day View</option>
                </select>
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
                      "min-h-[120px] p-2 relative transition-colors duration-300 group",
                      day.isCurrentMonth ? "bg-transparent" : "bg-gray-50/10 dark:bg-slate-900/20 opacity-40"
                    )}
                  >
                    <div className={cn(
                      "text-xs font-bold mb-2 flex items-center justify-center w-6 h-6 rounded-lg transition-all",
                      day.date === 10 && day.isCurrentMonth ? "bg-primary-100 text-white shadow-neon-primary scale-110" : "text-muted-foreground group-hover:text-primary-100"
                    )}>
                      {day.date}
                    </div>
                    <div className="space-y-1.5">
                      {day.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={cn(
                            "px-2 py-1.5 text-[10px] font-bold rounded-lg shadow-sm border border-white/20 backdrop-blur-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 text-white",
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
        </div>

        <div className="space-y-6">
          {/* Mini Calendar Widget */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-xl">
            <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary-100">Mini Calendar</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white/20">
                  <ChevronLeft size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white/20">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <MiniCalendar />
            </CardContent>
          </Card>

          {/* Filters Widget */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-xl">
            <CardHeader className="p-4 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary-100 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Type Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { id: 'task', label: 'My Tasks', color: 'bg-primary-100' },
                { id: 'events', label: 'Institutional Events', color: 'bg-green-500' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm", item.color)} />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-100 transition-colors uppercase tracking-tight">{item.label}</span>
                  </div>
                  <Checkbox
                    defaultChecked
                    className="border-white/40 dark:border-slate-600 data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Labels Widget */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-xl">
            <CardHeader className="p-4 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary-100 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Quick Labels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <LabelItem color="bg-amber-100 text-amber-800 border-amber-200" name="Lecture Classes" />
              <LabelItem color="bg-green-100 text-green-800 border-green-200" name="Staff Meetings" />
              <LabelItem color="bg-red-100 text-red-800 border-red-200" name="Practical Sessions" />
              <LabelItem color="bg-blue-100 text-blue-800 border-blue-200" name="Test Grading" />
              <LabelItem color="bg-pink-100 text-pink-800 border-pink-200" name="Missed Classes" />
            </CardContent>
          </Card>

          {/* Featured Card */}
          <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-neon-primary text-white overflow-hidden group relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <CheckCircle2 size={120} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Next Major Task</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-black mb-1">Final HCI Grading</h3>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Nov 18, 2021 • EOD</p>
              <Button variant="outline" className="mt-4 w-full rounded-xl bg-white/10 border-white/30 hover:bg-white/20 text-white font-bold h-10 uppercase tracking-widest text-[10px]">
                Open Gradebook
              </Button>
            </CardContent>
          </Card>
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
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-100">Nov 2021</span>
      </div>
      <div className="grid grid-cols-7 mb-2 border-b border-white/10 pb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[9px] font-black text-muted-foreground uppercase">
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
                className={cn(
                  "text-center p-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                  isCurrentMonth ? "text-gray-700 dark:text-gray-300 hover:bg-white/30" : "text-gray-400 opacity-20",
                  isToday ? "bg-primary-100 text-white shadow-neon-primary scale-110" : ""
                )}
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

function LabelItem({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color.split(" ")[0])}></div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight opacity-80 group-hover:opacity-100">{name}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground">
        <MoreHorizontal size={14} />
      </Button>
    </div>
  )
}

function generateCalendarDays() {
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
    events: [{ title: "HCI Presentations", color: "bg-primary-100" }],
  })
  days.push({
    date: 18,
    isCurrentMonth: true,
    events: [{ title: "Submission Deadline", color: "bg-amber-600" }],
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
    events: [{ title: "One to one meeting", color: "bg-pink-500" }],
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
