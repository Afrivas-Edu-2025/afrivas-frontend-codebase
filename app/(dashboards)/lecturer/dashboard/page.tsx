"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  Calendar,
  Activity,
  MapPin,
  ChevronRight,
  Layers,
  UserCheck,
  CheckCircle2,
  XCircle,
  Timer,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  CheckCheck,
} from "lucide-react"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import {
  useGetMyClassesQuery,
  useGetMyStudentsQuery,
  useGetLecturerAssignedModulesQuery,
  useGetLecturerScheduleQuery,
  useGetClassStudentsForAttendanceQuery,
  useGetAttendanceByClassQuery,
  useMarkAttendanceMutation,
} from "@/services/adminApi"
import Link from "next/link"

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function formatTime(t: string) {
  if (!t) return ''
  try {
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return t
  }
}

// Timetable days are stored uppercase (e.g. "MONDAY"); normalize before comparing/sorting
function normalizeDay(day: string | null | undefined) {
  return (day || '').trim().toUpperCase()
}

function todayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ─── Attendance Sheet for a single session ────────────────────────────────────
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

function AttendanceSheet({ session }: { session: any }) {
  const [open, setOpen] = useState(false)
  const [marks, setMarks] = useState<Record<number, AttendanceStatus>>({})
  const [submitted, setSubmitted] = useState(false)

  const today = todayISO()

  const { data: studentsData, isLoading: studentsLoading } =
    useGetClassStudentsForAttendanceQuery(
      { classId: session.classId, moduleId: session.moduleId },
      { skip: !open }
    )
  const { data: existingData, isLoading: existingLoading } =
    useGetAttendanceByClassQuery(
      { classId: session.classId, date: today },
      { skip: !open }
    )
  const [markAttendance, { isLoading: saving }] = useMarkAttendanceMutation()

  const students: any[] = studentsData?.data || []
  const existing: any[] = existingData?.data || []

  // Pre-populate marks from existing attendance when data loads
  useEffect(() => {
    if (existing.length > 0 && students.length > 0) {
      const map: Record<number, AttendanceStatus> = {}
      for (const rec of existing) {
        map[rec.studentId] = rec.status as AttendanceStatus
      }
      setMarks(map)
      if (existing.length >= students.length) setSubmitted(true)
    }
  }, [existing.length, students.length])

  const setMark = (studentId: number, status: AttendanceStatus) => {
    setMarks(prev => ({ ...prev, [studentId]: status }))
  }

  const markAll = (status: AttendanceStatus) => {
    const m: Record<number, AttendanceStatus> = {}
    for (const s of students) m[s.id] = status
    setMarks(m)
  }

  const presentCount = Object.values(marks).filter(s => s === 'PRESENT').length
  const absentCount = Object.values(marks).filter(s => s === 'ABSENT').length
  const lateCount = Object.values(marks).filter(s => s === 'LATE').length
  const unmarkedCount = students.length - Object.keys(marks).length

  const handleSubmit = async () => {
    if (students.length === 0) return
    const records = students.map(s => ({
      studentId: s.id,
      status: marks[s.id] || 'ABSENT',
    }))
    try {
      await markAttendance({ classId: session.classId, date: today, records }).unwrap()
      setSubmitted(true)
    } catch (e) {
      console.error('Attendance save failed', e)
    }
  }

  const isLoading = studentsLoading || existingLoading

  return (
    <div className="rounded-3xl border border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Session header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            "w-1.5 h-12 rounded-full flex-shrink-0",
            submitted
              ? "bg-gradient-to-b from-emerald-500 to-teal-400"
              : "bg-gradient-to-b from-primary-100 to-cyan-400"
          )} />
          <div className="min-w-0">
            <p className="font-bold text-base text-gray-900 dark:text-white truncate">
              {session.moduleName}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {session.className}
              </span>
              {session.classroomName && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{session.classroomName}
                  </span>
                </>
              )}
              <span className="text-[10px] font-bold text-primary-100">
                {formatTime(session.startTime)} – {formatTime(session.endTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {submitted && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
              <CheckCheck className="w-3 h-3 mr-1" /> Submitted
            </Badge>
          )}
          <div className="p-2 rounded-xl bg-primary-100/10 border border-primary-100/20 text-primary-100">
            <ClipboardList className="w-4 h-4" />
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded attendance panel */}
      {open && (
        <div className="border-t border-white/10 dark:border-slate-700/50">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center opacity-40">
              <Users className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold text-sm">No students enrolled in this module yet</p>
            </div>
          ) : (
            <>
              {/* Bulk actions */}
              <div className="flex items-center justify-between px-6 py-3 bg-white/20 dark:bg-slate-800/20 border-b border-white/10">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {students.length} student{students.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground mr-1">Mark all:</span>
                  <button
                    onClick={() => markAll('PRESENT')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Present
                  </button>
                  <button
                    onClick={() => markAll('ABSENT')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    <XCircle className="w-3 h-3" /> Absent
                  </button>
                </div>
              </div>

              {/* Student rows */}
              <div className="divide-y divide-white/5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100/20">
                {students.map((student: any) => {
                  const status = marks[student.id]
                  return (
                    <div key={student.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/10 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 border border-white/20 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-primary-100/10 text-primary-100">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight truncate">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{student.email}</p>
                        </div>
                      </div>

                      {/* Status toggle buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                        <button
                          onClick={() => setMark(student.id, 'PRESENT')}
                          title="Present"
                          className={cn(
                            "w-9 h-9 rounded-2xl border flex items-center justify-center transition-all duration-200 font-bold",
                            status === 'PRESENT'
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                              : "bg-white/20 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                          )}
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => setMark(student.id, 'LATE')}
                          title="Late"
                          className={cn(
                            "w-9 h-9 rounded-2xl border flex items-center justify-center transition-all duration-200",
                            status === 'LATE'
                              ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110"
                              : "bg-white/20 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/40"
                          )}
                        >
                          <Timer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setMark(student.id, 'ABSENT')}
                          title="Absent"
                          className={cn(
                            "w-9 h-9 rounded-2xl border flex items-center justify-center transition-all duration-200",
                            status === 'ABSENT'
                              ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110"
                              : "bg-white/20 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-rose-500 hover:bg-rose-500/20 hover:border-rose-500/40"
                          )}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary + submit */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/10 dark:bg-slate-800/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-emerald-500">{presentCount} present</span>
                  <span className="text-amber-500">{lateCount} late</span>
                  <span className="text-rose-500">{absentCount} absent</span>
                  {unmarkedCount > 0 && <span className="text-muted-foreground">{unmarkedCount} unmarked</span>}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={saving || students.length === 0}
                  variant="premium"
                  className="h-10 rounded-2xl px-6 font-bold text-xs shadow-neon-primary"
                >
                  {saving ? (
                    <><Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" /> Saving...</>
                  ) : submitted ? (
                    <><CheckCheck className="mr-2 w-3.5 h-3.5" /> Update Attendance</>
                  ) : (
                    <><CheckCircle2 className="mr-2 w-3.5 h-3.5" /> Submit Attendance</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function LecturerDashboard() {
  const { user } = useAuth()

  const { data: classesData, isLoading: classesLoading } = useGetMyClassesQuery()
  const { data: studentsData, isLoading: studentsLoading } = useGetMyStudentsQuery()
  const { data: modulesData, isLoading: modulesLoading } = useGetLecturerAssignedModulesQuery()
  const { data: scheduleData, isLoading: scheduleLoading } = useGetLecturerScheduleQuery()

  const classes = classesData?.data || []
  const students = studentsData?.data?.students || []
  const modules = modulesData?.data || []
  const schedule = scheduleData?.data || []

  // Deduplicate classes by classId
  const uniqueClasses = classes.reduce<Record<number, any>>((acc, entry) => {
    if (!acc[entry.classId]) acc[entry.classId] = { ...entry, sessions: [] }
    acc[entry.classId].sessions.push({ day: entry.day, startTime: entry.startTime, endTime: entry.endTime, moduleCode: entry.moduleCode, classroomName: entry.classroomName })
    return acc
  }, {})
  const classList = Object.values(uniqueClasses)

  // Group schedule by day (normalized key so "Monday"/"MONDAY" don't split into separate groups)
  const scheduleByDay = schedule.reduce<Record<string, any[]>>((acc, entry) => {
    const day = normalizeDay(entry.day) || 'UNKNOWN'
    if (!acc[day]) acc[day] = []
    acc[day].push(entry)
    return acc
  }, {})
  const sortedDays = Object.keys(scheduleByDay).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  )

  // Today's sessions for attendance — use `classes` (flattened: timetableId, className, moduleName, classroomName)
  const today = todayName()
  const todaySessions = classes.filter((s: any) => normalizeDay(s.day) === today)

  const uniqueStudentIds = new Set(students.map((s: any) => s.studentId))

  const statCards = [
    {
      title: "Classes",
      value: classesLoading ? "—" : String(classList.length),
      icon: BookOpen,
      desc: "Classes you teach",
      color: "text-blue-500",
      glow: "shadow-blue-500/10",
      trend: `${classes.length} sessions/week`,
    },
    {
      title: "Students",
      value: studentsLoading ? "—" : String(uniqueStudentIds.size),
      icon: Users,
      desc: "Enrolled in your modules",
      color: "text-purple-500",
      glow: "shadow-purple-500/10",
      trend: "across all modules",
    },
    {
      title: "Modules",
      value: modulesLoading ? "—" : String(modules.length),
      icon: Layers,
      desc: "Assigned to you",
      color: "text-emerald-500",
      glow: "shadow-emerald-500/10",
      trend: "this semester",
    },
    {
      title: "Today",
      value: classesLoading ? "—" : String(todaySessions.length),
      icon: ClipboardList,
      desc: `Sessions on ${today}`,
      color: "text-amber-500",
      glow: "shadow-amber-500/10",
      trend: todaySessions.length > 0 ? "attendance needed" : "no classes today",
    },
  ]

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-wide uppercase">
            <Activity className="w-3.5 h-3.5 mr-2" />
            Lecturer Dashboard
          </div>
          <TextGenerateEffect
            words="My Classes"
            className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-xl text-lg">
            Welcome back, <span className="text-primary-100 font-bold">{user?.firstName || user?.username || 'Professor'}</span>! Here is a snapshot of your teaching activity.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <SummaryCard
            key={idx}
            title={card.title}
            value={card.value}
            description={card.desc}
            icon={<card.icon className="h-5 w-5" />}
            color={card.color}
            glow={card.glow}
            trend={card.trend}
          />
        ))}
      </div>

      <Tabs defaultValue="attendance" className="space-y-10">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-1.5 rounded-3xl h-16 flex w-fit overflow-x-auto">
          <TabsTrigger value="attendance" className="rounded-2xl px-7 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm whitespace-nowrap">
            Attendance
            {todaySessions.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black bg-amber-500 text-white rounded-full leading-none">{todaySessions.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="classes" className="rounded-2xl px-7 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm whitespace-nowrap">My Classes</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-2xl px-7 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm whitespace-nowrap">Schedule</TabsTrigger>
          <TabsTrigger value="modules" className="rounded-2xl px-7 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm whitespace-nowrap">My Modules</TabsTrigger>
          <TabsTrigger value="students" className="rounded-2xl px-7 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm whitespace-nowrap">Students</TabsTrigger>
        </TabsList>

        {/* ── Attendance Tab ── */}
        <TabsContent value="attendance" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {today}&apos;s Attendance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {todaySessions.length > 0 && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/20 font-bold text-xs">
                {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} today
              </Badge>
            )}
          </div>

          {scheduleLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : todaySessions.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <ClipboardList className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No classes scheduled for {today}</p>
                <p className="text-xs mt-1">Check the Schedule tab for your weekly timetable</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todaySessions.map((session: any) => (
                <AttendanceSheet key={session.timetableId} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── My Classes ── */}
        <TabsContent value="classes" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {classesLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : classList.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <BookOpen className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No classes assigned yet</p>
                <p className="text-xs mt-1">You will see your classes here once timetable entries are created</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {classList.map((cls: any) => (
                <Card key={cls.classId}
                  className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-start gap-4 pb-4">
                    <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50">
                      <GraduationCap className="h-6 w-6 text-primary-100" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold leading-tight">{cls.className}</CardTitle>
                      <CardDescription className="font-semibold text-primary-100 text-xs mt-0.5">{cls.classCode}</CardDescription>
                      {cls.levelName && (
                        <Badge variant="outline" className="text-[10px] border-white/20 mt-1.5">{cls.levelName}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {cls.sessions?.slice(0, 2).map((session: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/30 dark:bg-slate-800/30 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-100 to-cyan-400" />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{session.moduleCode}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="uppercase tracking-wider">{session.day}</span>
                            <span>{formatTime(session.startTime)} – {formatTime(session.endTime)}</span>
                          </div>
                        </div>
                      ))}
                      {cls.sessions?.length > 2 && (
                        <p className="text-[10px] text-muted-foreground text-right px-1">+{cls.sessions.length - 2} more sessions</p>
                      )}
                    </div>
                    <Link href={`/admin/classes/${cls.classId}`}>
                      <Button variant="outline" size="sm" className="w-full rounded-2xl border-white/20 text-xs font-bold hover:bg-primary-100/10 hover:text-primary-100 transition-all">
                        View Class <ChevronRight className="ml-1 w-3 h-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Schedule ── */}
        <TabsContent value="schedule" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {scheduleLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : schedule.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <Calendar className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No schedule entries yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Weekly Schedule
                </CardTitle>
                <CardDescription className="font-medium">Your teaching sessions this week</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {sortedDays.map((day) => (
                    <div key={day} className={cn("p-6 space-y-3", day === today && "bg-primary-100/5")}>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-primary-100 uppercase tracking-[0.2em]">{day}</h3>
                        {day === today && <Badge className="bg-primary-100/10 text-primary-100 border-primary-100/20 text-[9px] font-black">Today</Badge>}
                      </div>
                      <div className="space-y-2">
                        {scheduleByDay[day].map((entry: any) => (
                          <div key={entry.id}
                            className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-primary-100 to-cyan-400 shadow-neon-primary/30 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-gray-800 dark:text-gray-100">{entry.module?.moduleName || 'Unknown Module'}</p>
                                <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5">
                                  <GraduationCap className="h-3 w-3" />
                                  {entry.class?.name || 'No class'}
                                  {entry.classroom && (
                                    <>
                                      <span className="text-white/20">·</span>
                                      <MapPin className="h-3 w-3" />
                                      {entry.classroom.name}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs font-bold border px-3 py-1.5 rounded-xl uppercase tracking-wider bg-primary-100/10 text-primary-100 border-primary-100/20">
                              {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── My Modules ── */}
        <TabsContent value="modules" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {modulesLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : modules.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <Layers className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No modules assigned yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod: any) => {
                const modStudents = students.filter((s: any) => s.moduleId === mod.id)
                const modSessions = schedule.filter((s: any) => s.moduleId === mod.id)
                return (
                  <Card key={mod.id}
                    className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-primary-100/10 border border-primary-100/20 text-primary-100 shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm group-hover:text-primary-100 transition-colors leading-tight">
                            {mod.moduleName}
                          </p>
                          <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px] mt-1.5">
                            {mod.moduleCode}
                          </Badge>
                        </div>
                      </div>
                      {mod.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{mod.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {modStudents.length} student{modStudents.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {modSessions.length} session{modSessions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ── Students ── */}
        <TabsContent value="students" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {studentsLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : students.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <Users className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No students enrolled yet</p>
                <p className="text-xs mt-1">Students will appear here once they enroll in your modules</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Enrolled Students
                </CardTitle>
                <CardDescription className="font-medium">{uniqueStudentIds.size} student{uniqueStudentIds.size !== 1 ? 's' : ''} across your modules</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {students.slice(0, 20).map((student: any, i: number) => (
                    <div key={`${student.studentId}-${student.moduleId}-${i}`}
                      className="flex items-center justify-between p-5 hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white/20 dark:border-slate-700">
                          <AvatarFallback className="font-bold text-primary-100 bg-primary-100/10 text-xs">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm group-hover:text-primary-100 transition-colors">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px]">
                            {student.moduleCode}
                          </Badge>
                          {student.levelName && (
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{student.levelName}</span>
                          )}
                        </div>
                        <UserCheck className="w-4 h-4 text-emerald-500 opacity-60" />
                      </div>
                    </div>
                  ))}
                </div>
                {students.length > 20 && (
                  <div className="p-4 border-t border-white/5 text-center">
                    <p className="text-xs font-bold text-muted-foreground">
                      Showing 20 of {students.length} enrollment records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryCard({ title, value, description, icon, color, glow, trend }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-xs font-bold text-muted-foreground tracking-tight">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform group-hover:scale-110 group-hover:rotate-6", color, glow)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-4xl font-extrabold tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">{value}</div>
        <p className="text-[11px] font-bold text-muted-foreground tracking-tight">{description}</p>
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-primary-100 italic">{trend}</span>
          <Activity className="w-3 h-3 text-primary-100/20" />
        </div>
      </CardContent>
    </Card>
  )
}
