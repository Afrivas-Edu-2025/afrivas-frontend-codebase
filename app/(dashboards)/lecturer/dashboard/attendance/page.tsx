"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Timer,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCheck,
  Users,
  Calendar,
  MapPin,
  History,
  TrendingUp,
  Activity,
} from "lucide-react"
import {
  useGetMyClassesQuery,
  useGetClassStudentsForAttendanceQuery,
  useGetAttendanceByClassQuery,
  useMarkAttendanceMutation,
  useGetAllAttendanceQuery,
} from "@/services/adminApi"

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatTime(t: string) {
  if (!t) return ""
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  catch { return t }
}
// Timetable days are stored uppercase (e.g. "MONDAY"); normalize before comparing
function todayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
}
function normalizeDay(day: string | null | undefined) {
  return (day || "").trim().toUpperCase()
}
function todayISO() {
  return new Date().toISOString().split("T")[0]
}
function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }
  catch { return d }
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE"
const STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ABSENT: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  LATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

// ─── Single session attendance sheet ─────────────────────────────────────────
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

  useEffect(() => {
    if (existing.length > 0 && students.length > 0) {
      const map: Record<number, AttendanceStatus> = {}
      for (const rec of existing) map[rec.studentId] = rec.status as AttendanceStatus
      setMarks(map)
      if (existing.length >= students.length) setSubmitted(true)
    }
  }, [existing.length, students.length])

  const setMark = (id: number, s: AttendanceStatus) => setMarks(p => ({ ...p, [id]: s }))
  const markAll = (s: AttendanceStatus) => {
    const m: Record<number, AttendanceStatus> = {}
    for (const st of students) m[st.id] = s
    setMarks(m)
  }

  const presentCount = Object.values(marks).filter(s => s === "PRESENT").length
  const absentCount  = Object.values(marks).filter(s => s === "ABSENT").length
  const lateCount    = Object.values(marks).filter(s => s === "LATE").length
  const unmarked     = students.length - Object.keys(marks).length

  const handleSubmit = async () => {
    if (!students.length) return
    const records = students.map(s => ({ studentId: s.id, status: marks[s.id] || "ABSENT" }))
    try {
      await markAttendance({ classId: session.classId, date: today, records }).unwrap()
      setSubmitted(true)
    } catch (e) { console.error(e) }
  }

  const isLoading = studentsLoading || existingLoading

  return (
    <div className="rounded-3xl border border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            "w-1.5 h-12 rounded-full flex-shrink-0",
            submitted ? "bg-gradient-to-b from-emerald-500 to-teal-400" : "bg-gradient-to-b from-primary-100 to-cyan-400"
          )} />
          <div className="min-w-0">
            <p className="font-bold text-base text-gray-900 dark:text-white truncate">{session.moduleName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{session.className}</span>
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
              <CheckCheck className="w-3 h-3 mr-1" />Submitted
            </Badge>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-white/10 dark:border-slate-700/50">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Loading students…</span>
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
                  {students.length} student{students.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground mr-1">Mark all:</span>
                  <button
                    onClick={() => markAll("PRESENT")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />Present
                  </button>
                  <button
                    onClick={() => markAll("ABSENT")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    <XCircle className="w-3 h-3" />Absent
                  </button>
                </div>
              </div>

              {/* Student rows */}
              <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
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
                          <p className="font-bold text-sm truncate">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                        {(["PRESENT", "LATE", "ABSENT"] as AttendanceStatus[]).map(s => (
                          <button
                            key={s}
                            onClick={() => setMark(student.id, s)}
                            title={s.charAt(0) + s.slice(1).toLowerCase()}
                            className={cn(
                              "w-9 h-9 rounded-2xl border flex items-center justify-center transition-all duration-200",
                              status === s
                                ? s === "PRESENT" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                                  : s === "LATE"    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110"
                                  : "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110"
                                : s === "PRESENT" ? "bg-white/20 dark:bg-slate-800/20 border-white/20 text-emerald-500 hover:bg-emerald-500/20"
                                  : s === "LATE"    ? "bg-white/20 dark:bg-slate-800/20 border-white/20 text-amber-500 hover:bg-amber-500/20"
                                  : "bg-white/20 dark:bg-slate-800/20 border-white/20 text-rose-500 hover:bg-rose-500/20"
                            )}
                          >
                            {s === "PRESENT" ? <CheckCircle2 className="w-4 h-4" />
                              : s === "LATE"  ? <Timer className="w-4 h-4" />
                              : <XCircle className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/10 dark:bg-slate-800/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-emerald-500">{presentCount} present</span>
                  <span className="text-amber-500">{lateCount} late</span>
                  <span className="text-rose-500">{absentCount} absent</span>
                  {unmarked > 0 && <span className="text-muted-foreground">{unmarked} unmarked</span>}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !students.length}
                  variant="premium"
                  className="h-10 rounded-2xl px-6 font-bold text-xs shadow-neon-primary"
                >
                  {saving ? (
                    <><Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />Saving…</>
                  ) : submitted ? (
                    <><CheckCheck className="mr-2 w-3.5 h-3.5" />Update Attendance</>
                  ) : (
                    <><CheckCircle2 className="mr-2 w-3.5 h-3.5" />Submit Attendance</>
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LecturerAttendancePage() {
  const today = todayName()
  const todayDate = todayISO()

  const { data: classesData, isLoading: classesLoading } = useGetMyClassesQuery()
  const { data: historyData, isLoading: historyLoading } = useGetAllAttendanceQuery()

  const classes: any[] = classesData?.data || []
  const history: any[] = historyData?.data || []

  const todaySessions = classes.filter((s: any) => normalizeDay(s.day) === today)

  // Compute quick stats from history
  const totalRecords  = history.length
  const presentCount  = history.filter((r: any) => r.status === "PRESENT").length
  const absentCount   = history.filter((r: any) => r.status === "ABSENT").length
  const lateCount     = history.filter((r: any) => r.status === "LATE").length
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0

  // Group history by date for display
  const byDate = history.reduce<Record<string, any[]>>((acc, rec) => {
    const d = rec.date ? rec.date.split("T")[0] : "unknown"
    if (!acc[d]) acc[d] = []
    acc[d].push(rec)
    return acc
  }, {})
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a)).slice(0, 30)

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-wide uppercase">
          <ClipboardList className="w-3.5 h-3.5 mr-2" />
          Attendance
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <p className="text-muted-foreground font-medium">
          Take daily attendance for your classes and track student presence over time.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sessions", value: classesLoading ? "—" : String(todaySessions.length), icon: Calendar, color: "text-blue-500" },
          { label: "Attendance Rate",  value: historyLoading ? "—" : `${attendanceRate}%`,         icon: TrendingUp, color: "text-emerald-500" },
          { label: "Present (all)",    value: historyLoading ? "—" : String(presentCount),          icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Absent (all)",     value: historyLoading ? "—" : String(absentCount),           icon: XCircle,  color: "text-rose-500" },
        ].map(stat => (
          <Card key={stat.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="take" className="space-y-8">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-1.5 rounded-3xl h-14 flex w-fit">
          <TabsTrigger value="take" className="rounded-2xl px-7 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white transition-all duration-300 font-bold text-sm">
            Take Attendance
            {todaySessions.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black bg-amber-500 text-white rounded-full leading-none">
                {todaySessions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-2xl px-7 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white transition-all duration-300 font-bold text-sm">
            History
          </TabsTrigger>
        </TabsList>

        {/* ── Take Attendance ── */}
        <TabsContent value="take" className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{today}'s Classes</h2>
              <p className="text-xs text-muted-foreground font-medium">
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            {todaySessions.length > 0 && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/20 font-bold text-xs">
                {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""} today
              </Badge>
            )}
          </div>

          {classesLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : todaySessions.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-20 text-center opacity-40">
                <ClipboardList className="w-14 h-14 mx-auto mb-4" />
                <p className="font-bold">No classes scheduled for {today}</p>
                <p className="text-sm mt-1">Your timetable shows no sessions today</p>
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

        {/* ── History ── */}
        <TabsContent value="history" className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
          <div>
            <h2 className="text-lg font-bold">Attendance History</h2>
            <p className="text-xs text-muted-foreground font-medium">Past attendance records grouped by date</p>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary-100/50" />
            </div>
          ) : history.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-20 text-center opacity-40">
                <History className="w-14 h-14 mx-auto mb-4" />
                <p className="font-bold">No attendance records yet</p>
                <p className="text-sm mt-1">Submit attendance in the "Take Attendance" tab to see records here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => {
                const records = byDate[date]
                const dayPresent = records.filter((r: any) => r.status === "PRESENT").length
                const dayTotal   = records.length
                const rate       = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100) : 0
                return (
                  <Card key={date} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-white/10 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold">{fmtDate(date)}</CardTitle>
                        <CardDescription className="text-[10px]">
                          {dayPresent}/{dayTotal} present · {rate}% attendance
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-white/20 dark:bg-slate-700/50 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-500" : "bg-rose-500")}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground">{rate}%</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                        {records.map((rec: any) => (
                          <div key={rec.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-white/20">
                                <AvatarFallback className="text-[10px] font-bold bg-primary-100/10 text-primary-100">
                                  {rec.student?.user?.firstName?.[0]}{rec.student?.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm">
                                  {rec.student?.user?.firstName} {rec.student?.user?.lastName}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{rec.class?.name}</p>
                              </div>
                            </div>
                            <Badge className={cn("text-[10px] font-bold border", STATUS_COLORS[rec.status as AttendanceStatus] || "bg-gray-500/10 text-gray-600 border-gray-500/20")}>
                              {rec.status === "PRESENT" ? <CheckCircle2 className="w-3 h-3 mr-1" />
                                : rec.status === "LATE" ? <Timer className="w-3 h-3 mr-1" />
                                : <XCircle className="w-3 h-3 mr-1" />}
                              {rec.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {Object.keys(byDate).length > 30 && (
                <p className="text-center text-xs text-muted-foreground font-bold">Showing last 30 days</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
