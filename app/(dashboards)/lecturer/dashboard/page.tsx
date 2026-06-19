"use client"

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
} from "@/services/adminApi"
import Link from "next/link"

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function formatTime(t: string) {
  if (!t) return ''
  try {
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return t
  }
}

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

  // Group schedule by day
  const scheduleByDay = schedule.reduce<Record<string, any[]>>((acc, entry) => {
    const day = entry.day || 'Unknown'
    if (!acc[day]) acc[day] = []
    acc[day].push(entry)
    return acc
  }, {})
  const sortedDays = Object.keys(scheduleByDay).sort(
    (a, b) => (DAY_ORDER.indexOf(a) ?? 99) - (DAY_ORDER.indexOf(b) ?? 99)
  )

  // Unique students (by studentId)
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
      title: "Sessions / Week",
      value: scheduleLoading ? "—" : String(schedule.length),
      icon: Calendar,
      desc: "Scheduled sessions",
      color: "text-amber-500",
      glow: "shadow-amber-500/10",
      trend: `${sortedDays.length} days active`,
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

      <Tabs defaultValue="classes" className="space-y-10">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-1.5 rounded-3xl h-16 flex w-fit">
          <TabsTrigger value="classes" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">My Classes</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Schedule</TabsTrigger>
          <TabsTrigger value="modules" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">My Modules</TabsTrigger>
          <TabsTrigger value="students" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Students</TabsTrigger>
        </TabsList>

        {/* My Classes */}
        <TabsContent value="classes" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {classesLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
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
              {classList.map((cls: any) => {
                const studentCount = students.filter((s: any) =>
                  classes.some((c: any) => c.classId === cls.classId && c.moduleCode === s.moduleCode)
                ).length
                return (
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
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="schedule" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {scheduleLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
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
                    <div key={day} className="p-6 space-y-3">
                      <h3 className="text-xs font-black text-primary-100 uppercase tracking-[0.2em]">{day}</h3>
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

        {/* My Modules */}
        <TabsContent value="modules" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {modulesLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
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

        {/* Students */}
        <TabsContent value="students" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {studentsLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
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
