'use client'

import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LineChart,
  Calendar,
  Search,
  Sparkles,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default function AttendancePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Presence Analytics
            </span>
          </div>
          <TextGenerateEffect
            words="Attendance Tracker"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Monitor your commitment and academic presence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold uppercase tracking-widest text-[10px] h-11 px-6">
            Export Report
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Request Excuse
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="OVERALL PRESENCE"
          value="92.5%"
          description="148 Presence Records"
          icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
          color="from-emerald-500/10 to-transparent border-emerald-500/20"
          valueColor="text-emerald-500"
          trend="+2.4% vs last month"
        />
        <SummaryCard
          title="ABSENCES"
          value="3 Days"
          description="2.0% Absence Rate"
          icon={<XCircle className="h-4 w-4 text-rose-500" />}
          color="from-rose-500/10 to-transparent border-rose-500/20"
          valueColor="text-rose-500"
          trend="Decreasing trend"
        />
        <SummaryCard
          title="EXCUSED LOGS"
          value="9 Marks"
          description="5.5% Excusal Rate"
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
          color="from-amber-500/10 to-transparent border-amber-500/20"
          valueColor="text-amber-500"
          trend="Medical & Personal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Calendar & Filters */}
        <div className="lg:col-span-8 space-y-8">
          {/* Calendar View */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 p-6 bg-white/10 dark:bg-slate-900/10">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-100/10 text-primary-100">
                  <ChevronLeft size={20} />
                </Button>
                <div className="text-center">
                  <h2 className="text-xl font-black uppercase tracking-widest text-primary-100">May 2025</h2>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary-100/10 text-primary-100">
                  <ChevronRight size={20} />
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-neon-primary animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Excused</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-7 text-center bg-white/5 border-b border-white/5">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="py-4 text-[10px] font-black text-primary-100/60 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-white/5">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[110px] p-3 bg-white/40 dark:bg-slate-900/40 transition-all duration-300 relative group overflow-hidden",
                      day.isCurrentMonth ? "hover:bg-white/60 dark:hover:bg-slate-800/60" : "opacity-30"
                    )}
                  >
                    <div className={cn(
                      "text-xs font-black tracking-tighter mb-2",
                      day.isCurrentMonth ? "text-gray-800 dark:text-gray-100" : "text-muted-foreground"
                    )}>
                      {day.date.toString().padStart(2, '0')}
                    </div>
                    {day.status && (
                      <div className="flex justify-center items-center h-12">
                        <div className={cn(
                          "flex items-center justify-center rounded-xl p-2.5 border backdrop-blur-md shadow-lg transition-transform duration-500 group-hover:scale-110",
                          getStatusColor(day.status)
                        )}>
                          {getStatusIcon(day.status)}
                        </div>
                      </div>
                    )}
                    {day.date === 15 && day.isCurrentMonth && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-100 shadow-neon-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Records */}
        <div className="lg:col-span-4 space-y-8">
          {/* Detailed Filters & Search */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="p-6 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-100" />
                Roster Filtration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Institutional Course</label>
                <select className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none">
                  <option value="all">Comprehensive Analysis</option>
                  <option value="math">Mathematics (MATH-201)</option>
                  <option value="cs">Computer Science (CS-302)</option>
                  <option value="physics">Physics (PHY-101)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Chronological Range</label>
                <select className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none">
                  <option value="current">Current Academic Term</option>
                  <option value="last">Previous Term History</option>
                  <option value="year">Full Academic Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Presence Status</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Present", "Absent", "Excused"].map(s => (
                    <Badge key={s} variant="glass" className="cursor-pointer hover:bg-primary-100/20 transition-all px-3 py-1 font-black uppercase tracking-widest text-[8px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="premium" className="w-full rounded-2xl py-6 shadow-neon-primary mt-4 font-black uppercase tracking-widest text-[10px]">
                Synchronize Records
              </Button>
            </CardContent>
          </Card>

          {/* Insights Card */}
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 border-none shadow-lg shadow-emerald-500/20 text-white rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <LineChart size={140} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Engagement Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-black mb-1">Consistency Streak</h3>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">12 Days Continuous Presence</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="bg-white/20 rounded-xl px-4 py-2 border border-white/20 backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase">Excellence Tier: 1</span>
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Records Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Institutional Logs</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Detailed chronological history of academic presence</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
              <Input
                placeholder="Search logs..."
                className="h-9 pl-9 w-64 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/10 dark:bg-slate-900/10">
                <TableRow className="border-white/10">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-5">Temporal Mark</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department / Course</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scheduled Span</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contextual Annotations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100/5 text-primary-100">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight text-gray-800 dark:text-gray-100">{record.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{record.course}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-80">{record.time}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="glass"
                        className={cn(
                          "px-3 py-1 font-black uppercase tracking-widest text-[8px]",
                          getStatusBadgeColor(record.status)
                        )}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-muted-foreground italic truncate max-w-[200px] block">{record.notes || "—"}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 bg-white/5 border-t border-white/5">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Showing <span className="text-primary-100">10</span> of <span className="text-primary-100">148</span> Verification Records
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-100/10">Prev</Button>
              <div className="flex items-center">
                {[1, 2, 3].map(p => (
                  <Button key={p} variant={p === 1 ? "premium" : "ghost"} size="sm" className={cn("w-8 h-8 rounded-lg text-[10px] font-black", p !== 1 && "hover:bg-primary-100/10")}>{p}</Button>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-100/10">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  valueColor,
  trend
}: {
  title: string,
  value: string,
  description: string,
  icon: React.ReactNode,
  color: string,
  valueColor: string,
  trend: string
}) {
  return (
    <Card className={cn(
      "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500",
      color.includes("border") ? color : `border-white/20 dark:border-slate-800/50`
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className="p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20">{icon}</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className={cn("text-3xl font-black tracking-tighter mb-1", valueColor)}>{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full opacity-80", valueColor.replace('text', 'bg'))} style={{ width: '85%' }} />
          </div>
          <span className="text-[8px] font-black text-muted-foreground uppercase">{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "present":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/10"
    case "absent":
      return "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-rose-500/10"
    case "excused":
      return "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/10"
    default:
      return "bg-gray-100/10 border-gray-100/10"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "present":
      return <CheckCircle className="h-4 w-4" strokeWidth={3} />
    case "absent":
      return <XCircle className="h-4 w-4" strokeWidth={3} />
    case "excused":
      return <AlertCircle className="h-4 w-4" strokeWidth={3} />
    default:
      return null
  }
}

function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "present":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "absent":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20"
    case "excused":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    default:
      return "bg-muted text-muted-foreground border-transparent"
  }
}

function generateCalendarDays() {
  const days = []
  // Week 1 (Apr 27 - May 3)
  days.push({ date: 27, isCurrentMonth: false, status: null })
  days.push({ date: 28, isCurrentMonth: false, status: null })
  days.push({ date: 29, isCurrentMonth: false, status: null })
  days.push({ date: 30, isCurrentMonth: false, status: null })
  days.push({ date: 1, isCurrentMonth: true, status: "present" })
  days.push({ date: 2, isCurrentMonth: true, status: "present" })
  days.push({ date: 3, isCurrentMonth: true, status: null })
  // Week 2 (May 4 - 10)
  days.push({ date: 4, isCurrentMonth: true, status: null })
  days.push({ date: 5, isCurrentMonth: true, status: "present" })
  days.push({ date: 6, isCurrentMonth: true, status: "present" })
  days.push({ date: 7, isCurrentMonth: true, status: "present" })
  days.push({ date: 8, isCurrentMonth: true, status: "present" })
  days.push({ date: 9, isCurrentMonth: true, status: "present" })
  days.push({ date: 10, isCurrentMonth: true, status: null })
  // Week 3 (May 11 - 17)
  days.push({ date: 11, isCurrentMonth: true, status: null })
  days.push({ date: 12, isCurrentMonth: true, status: "present" })
  days.push({ date: 13, isCurrentMonth: true, status: "excused" })
  days.push({ date: 14, isCurrentMonth: true, status: "present" })
  days.push({ date: 15, isCurrentMonth: true, status: "present" })
  days.push({ date: 16, isCurrentMonth: true, status: "present" })
  days.push({ date: 17, isCurrentMonth: true, status: null })
  // Week 4 (May 18 - 24)
  days.push({ date: 18, isCurrentMonth: true, status: null })
  days.push({ date: 19, isCurrentMonth: true, status: "present" })
  days.push({ date: 20, isCurrentMonth: true, status: "present" })
  days.push({ date: 21, isCurrentMonth: true, status: "absent" })
  days.push({ date: 22, isCurrentMonth: true, status: "present" })
  days.push({ date: 23, isCurrentMonth: true, status: "present" })
  days.push({ date: 24, isCurrentMonth: true, status: null })
  // Week 5 (May 25 - 31)
  days.push({ date: 25, isCurrentMonth: true, status: null })
  days.push({ date: 26, isCurrentMonth: true, status: "present" })
  days.push({ date: 27, isCurrentMonth: true, status: "present" })
  days.push({ date: 28, isCurrentMonth: true, status: "present" })
  days.push({ date: 29, isCurrentMonth: true, status: "present" })
  days.push({ date: 30, isCurrentMonth: true, status: "present" })
  days.push({ date: 31, isCurrentMonth: true, status: null })
  return days
}

const attendanceRecords = [
  { id: 1, date: "May 01, 2025", course: "Mathematics (MATH-201)", time: "10:00 AM - 11:30 AM", status: "Present", notes: "" },
  { id: 2, date: "May 02, 2025", course: "Computer Science (CS-302)", time: "01:00 PM - 02:30 PM", status: "Present", notes: "" },
  { id: 3, date: "May 05, 2025", course: "Physics (PHY-101)", time: "09:00 AM - 10:30 AM", status: "Present", notes: "" },
  { id: 4, date: "May 06, 2025", course: "English Literature (ENG-150)", time: "11:00 AM - 12:30 PM", status: "Present", notes: "" },
  { id: 5, date: "May 07, 2025", course: "Mathematics (MATH-201)", time: "10:00 AM - 11:30 AM", status: "Present", notes: "" },
  { id: 6, date: "May 08, 2025", course: "Computer Science (CS-302)", time: "01:00 PM - 02:30 PM", status: "Present", notes: "" },
  { id: 7, date: "May 09, 2025", course: "Physics (PHY-101)", time: "09:00 AM - 10:30 AM", status: "Present", notes: "" },
  { id: 8, date: "May 12, 2025", course: "English Literature (ENG-150)", time: "11:00 AM - 12:30 PM", status: "Present", notes: "" },
  { id: 9, date: "May 13, 2025", course: "Mathematics (MATH-201)", time: "10:00 AM - 11:30 AM", status: "Excused", notes: "Verified Medical Consultation" },
  { id: 10, date: "May 14, 2025", course: "Computer Science (CS-302)", time: "01:00 PM - 02:30 PM", status: "Present", notes: "" },
]
