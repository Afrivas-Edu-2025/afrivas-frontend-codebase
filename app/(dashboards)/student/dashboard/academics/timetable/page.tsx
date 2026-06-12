'use client'

import { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  BookOpen,
  User,
  Calendar,
  LayoutGrid,
  Map,
  Sparkles,
  ArrowRight,
  TrendingUp,
  History,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"
import { useGetMyTimetableQuery } from '@/services/studentApi'

const DAY_MAP: Record<string, number> = {
  Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const COLORS = [
  "bg-emerald-500/20 text-emerald-100 border-emerald-500/30",
  "bg-indigo-500/20 text-indigo-100 border-indigo-500/30",
  "bg-amber-500/20 text-amber-100 border-amber-500/30",
  "bg-rose-500/20 text-rose-100 border-rose-500/30",
  "bg-cyan-500/20 text-cyan-100 border-cyan-500/30",
  "bg-violet-500/20 text-violet-100 border-violet-500/30",
  "bg-orange-500/20 text-orange-100 border-orange-500/30",
]

function formatTime(d: Date): string {
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

function getHourDecimal(d: Date): number {
  return d.getUTCHours() + d.getUTCMinutes() / 60
}

function getDayNumber(day: string): number {
  return DAY_MAP[day] ?? 0
}

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
]

export default function TimetablePage() {
  const { data: timetableRes, isLoading } = useGetMyTimetableQuery()
  const timetable: any[] = timetableRes?.data || []

  const classes = useMemo(() => {
    const colorMap: Record<string, string> = {}
    let colorIdx = 0
    return timetable.map((entry: any) => {
      const key = entry.moduleId
      if (!colorMap[key]) {
        colorMap[key] = COLORS[colorIdx % COLORS.length]
        colorIdx++
      }
      const start = new Date(entry.startTime)
      const end = new Date(entry.endTime)
      return {
        id: entry.id,
        moduleId: entry.moduleId,
        name: `${entry.module.moduleCode} — ${entry.module.moduleName}`,
        day: getDayNumber(entry.day),
        startHour: start.getUTCHours(),
        startMinute: start.getUTCMinutes(),
        endHour: end.getUTCHours(),
        endMinute: end.getUTCMinutes(),
        time: `${formatTime(start)} — ${formatTime(end)}`,
        location: entry.classLocation || 'TBD',
        instructor: entry.module.lecturer
          ? `${entry.module.lecturer.user.firstName} ${entry.module.lecturer.user.lastName}`
          : 'TBD',
        premiumColor: colorMap[key],
      }
    })
  }, [timetable])

  const todayClasses = useMemo(() => {
    const todayIdx = new Date().getDay() - 1
    const dayIdx = todayIdx >= 0 && todayIdx <= 6 ? todayIdx : 0
    return classes
      .filter((c) => c.day === dayIdx)
      .map((c) => ({
        id: c.id,
        name: c.name,
        time: c.time,
        location: c.location,
        instructor: c.instructor,
        type: 'Lecture',
        status: 'Upcoming',
        statusBadge: 'bg-primary-100/20 text-primary-100',
        iconColor: c.premiumColor.split(' ')[0].replace('bg-', 'text-'),
        icon: <BookOpen className="h-5 w-5" />,
      }))
  }, [classes])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-100" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Chronological Roster
            </span>
          </div>
          <TextGenerateEffect
            words="Academic Timetable"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Navigate your scholastic journey with precision</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
            <History className="mr-2 h-4 w-4" />
            Archive View
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Print Schedule
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-100/10 text-primary-100">
              <ChevronLeft size={20} />
            </Button>
            <div className="text-center px-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary-100 whitespace-nowrap">Weekly Schedule</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-100/10 text-primary-100">
              <ChevronRight size={20} />
            </Button>
          </div>

          <div className="flex items-center p-1 bg-white/10 dark:bg-slate-900/50 rounded-xl border border-white/10">
            {["Week", "Day", "Month"].map((view) => (
              <Button
                key={view}
                variant={view === "Week" ? "premium" : "ghost"}
                className={cn(
                  "px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  view !== "Week" && "hover:bg-white/10 text-muted-foreground"
                )}
              >
                {view}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {classes.length === 0 ? (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 dark:border-slate-800/50 rounded-3xl">
          <CardContent className="py-20 text-center opacity-40">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p className="font-bold text-lg">No classes scheduled</p>
            <p className="text-sm text-muted-foreground mt-1">Your timetable will appear here once classes are assigned</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Weekly Timetable Grid */}
          <div className="lg:col-span-8">
            <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <div className="grid grid-cols-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/40">
                <div className="py-4 px-2 text-center text-[10px] font-black text-primary-100/60 uppercase tracking-widest border-r border-white/5">Mark</div>
                {DAY_LABELS.map(day => (
                  <div key={day} className="py-4 px-2 text-center text-[10px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="grid grid-cols-8 divide-x divide-white/5 bg-white/5">
                  {/* Time Axis */}
                  <div className="divide-y divide-white/5 bg-white/10 dark:bg-slate-900/10">
                    {timeSlots.map((time, index) => (
                      <div key={index} className="h-28 p-2 text-[9px] font-black text-muted-foreground text-center uppercase tracking-tighter flex items-start justify-center pt-4">
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {[...Array(7)].map((_, dayIndex) => (
                    <div key={dayIndex} className="relative divide-y divide-white/5 min-h-[1100px]">
                      {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-28 p-1"></div>
                      ))}

                      {/* Class Blocks */}
                      {classes
                        .filter((cls) => cls.day === dayIndex)
                        .map((cls) => (
                          <div
                            key={cls.id}
                            className={cn(
                              "absolute left-1 right-1 rounded-2xl p-3 border shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:z-20 group overflow-hidden",
                              cls.premiumColor
                            )}
                            style={{
                              top: `${(cls.startHour - 8) * 112 + (cls.startMinute / 60) * 112 + 4}px`,
                              height: `${(cls.endHour - cls.startHour) * 112 + ((cls.endMinute - cls.startMinute) / 60) * 112 - 8}px`,
                            }}
                          >
                            <div className="relative z-10 flex flex-col h-full">
                              <h3 className="font-black text-[11px] uppercase tracking-tight leading-tight mb-1 truncate group-hover:whitespace-normal transition-all">
                                {cls.name}
                              </h3>
                              <div className="mt-auto space-y-1">
                                <div className="flex items-center gap-1 opacity-70">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-[9px] font-bold uppercase">{cls.time}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-70">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-[9px] font-bold uppercase truncate">{cls.location.split(',')[0]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                              <Sparkles className="w-8 h-8" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Today's Agenda & Insights */}
          <div className="lg:col-span-4 space-y-8">
            {/* Agenda Card */}
            <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl">
              <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary-100">
                    <LayoutGrid className="w-4 h-4" />
                    Today's Roster
                  </CardTitle>
                </div>
                <Badge variant="glass" className="bg-primary-100/10 text-primary-100 font-black text-[8px] uppercase tracking-widest px-2 py-1">
                  {todayClasses.length > 0 ? 'Active Now' : 'No Classes'}
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {todayClasses.length === 0 ? (
                  <div className="text-center py-8 opacity-40">
                    <p className="font-bold text-sm">No classes today</p>
                  </div>
                ) : (
                  todayClasses.map((cls) => (
                    <div key={cls.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-white/10 group">
                      <div className={cn(
                        "absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white/50 backdrop-blur-md shadow-lg transition-all duration-500 group-hover:scale-150 group-hover:shadow-neon-primary",
                        "bg-primary-100"
                      )} />
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl bg-white/10 border border-white/5", cls.iconColor)}>
                              {cls.icon}
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-tight text-gray-800 dark:text-gray-100">{cls.name}</h4>
                          </div>
                          <Badge variant="glass" className={cn("text-[7px] font-black uppercase tracking-widest py-0.5", cls.statusBadge)}>
                            {cls.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                          <div className="flex items-center gap-1.5 opacity-60">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase">{cls.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-60">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase truncate">{cls.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-60">
                            <User className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase">{cls.instructor}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-60">
                            <BookOpen className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase">{cls.type}</span>
                          </div>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 h-9 rounded-xl border border-white/5 hover:bg-white/10 font-black uppercase text-[9px] tracking-[0.2em] text-primary-100">
                          Synchronize Materials
                          <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Efficiency Card */}
            {classes.length > 0 && (
              <>
                <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                    <TrendingUp size={140} />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Chronological Insight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-2xl font-black mb-1">Peak Utilization</h3>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                      {classes.length} class sessions scheduled across the week.
                    </p>
                    <div className="mt-8">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)] w-3/4 animate-pulse-slow" />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span>Weekly Progression</span>
                        <span>{classes.length} Sessions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 rounded-3xl border border-dashed border-primary-100/30 bg-primary-100/5 backdrop-blur-md flex items-center justify-between group cursor-pointer hover:bg-primary-100/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                      <Map className="w-5 h-5 text-primary-100" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-100">Campus Cartography</span>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Launch Interactive Map</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary-100 group-hover:translate-x-1 transition-transform" />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
