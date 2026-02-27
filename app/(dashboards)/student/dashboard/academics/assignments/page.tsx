'use client'

import {
  Filter,
  Search,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Layers,
  Zap,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function AssignmentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3 h-3" />
              Strategic Submissions
            </span>
          </div>
          <TextGenerateEffect
            words="Academic Milestones"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Orchestrate your scholastic deliverables with peak precision</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
            Submission Logic
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Priority Dispatch
          </Button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Consolidated"
          value="24"
          description="Total Deliverables"
          icon={<Layers className="h-4 w-4" />}
          color="text-indigo-500"
          glow="shadow-indigo-500/10"
        />
        <SummaryCard
          title="Verified"
          value="18"
          description="Success Quotient"
          icon={<CheckCircle className="h-4 w-4" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
        />
        <SummaryCard
          title="Active"
          value="04"
          description="Imminent Deadlines"
          icon={<Zap className="h-4 w-4" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
        />
        <SummaryCard
          title="Alert"
          value="02"
          description="Temporal Breach"
          icon={<AlertTriangle className="h-4 w-4" />}
          color="text-rose-500"
          glow="shadow-rose-500/10"
        />
      </div>

      {/* Roster Filtration */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[280px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="IDENTIFY TASK..."
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-xs font-black uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none h-12 min-w-[180px] appearance-none cursor-pointer">
                <option value="all">Global Curriculum</option>
                <option value="math">Mathematics Node</option>
                <option value="cs">Computing Hub</option>
                <option value="physics">Physics Sector</option>
              </select>

              <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-black uppercase tracking-[0.2em] text-[10px] h-12 px-6">
                <Filter className="h-4 w-4 mr-2" />
                Initialize Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Task Stream</h2>
              <Badge variant="glass" className="font-black text-[9px] bg-primary-100/10 border-primary-100/20 text-primary-100 px-3 uppercase tracking-widest">Active Sequence</Badge>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary-100 w-3/4 animate-pulse-slow shadow-neon-primary" />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase ml-2 tracking-widest">Stream Integrity</span>
            </div>
          </div>

          <div className="grid gap-6">
            {upcomingAssignments.map((assignment) => (
              <Card key={assignment.id} className="group border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-100/10 transition-all duration-500 rounded-3xl">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center gap-8 p-6 lg:p-8">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-2xl relative",
                      assignment.bgColor,
                      "border border-white/30 dark:border-white/10"
                    )}>
                      {assignment.icon}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-primary-100 shadow-lg">
                        <div className="w-1.5 h-1.5 bg-primary-100 rounded-full animate-pulse" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black tracking-tighter group-hover:text-primary-100 transition-colors uppercase leading-none">{assignment.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="p-1 rounded bg-white/10 border border-white/5">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{assignment.course}</span>
                          </div>
                        </div>
                        <Badge
                          variant="glass"
                          className={cn("px-4 py-1.5 font-black uppercase tracking-widest text-[9px] shadow-sm", assignment.statusColor)}
                        >
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-primary-100">
                          <Clock className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Temporal Node: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-500">
                          <Star className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{assignment.points} Credit Weight</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] mb-1">
                          <span className="text-muted-foreground">Progression Heuristic</span>
                          <span className="text-primary-100">{assignment.progress}</span>
                        </div>
                        <div className="relative h-2 w-full bg-black/5 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-100 to-indigo-600 rounded-full shadow-neon-primary transition-all duration-1000 ease-out"
                            style={{ width: assignment.progress }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" className="hidden lg:flex flex-col items-center justify-center w-16 h-16 rounded-2xl border border-white/10 hover:bg-primary-100 hover:text-white transition-all shadow-xl group/btn">
                      <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-1">OPEN</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* History Stream */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Chronicle</h2>
            <Badge variant="glass" className="font-bold border-emerald-500/20 text-emerald-500 bg-emerald-500/5">Verified</Badge>
          </div>

          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/5 bg-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Historical Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {completedAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-6 hover:bg-white/10 transition-all group cursor-pointer relative">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-tighter truncate max-w-[180px] group-hover:text-primary-100 transition-colors">{assignment.title}</h4>
                      <Badge variant="glass" className="text-[9px] font-black uppercase tracking-widest h-6 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald">
                        {assignment.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{assignment.course}</p>
                      <div className="flex items-center gap-1.5 opacity-50">
                        <CheckCircle className="w-3 h-3" />
                        <p className="text-[9px] font-bold uppercase">{assignment.submittedDate}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5">
                <Button variant="ghost" className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-primary-100 hover:bg-primary-100 hover:text-white transition-all">
                  Global Archives
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pulse Insight */}
          <Card className="bg-gradient-to-br from-indigo-600 to-primary-100 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden group relative p-8">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <TrendingUp size={160} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Executive Heuristic
              </h4>
              <h3 className="text-3xl font-black mb-2 leading-none uppercase tracking-tighter italic">Peak Velocity</h3>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest leading-relaxed">System performance indicates you are operating within the top <span className="text-white bg-white/20 px-1.5 rounded">05th Percentile</span> of global academic nodes.</p>
              <Button className="mt-8 w-full rounded-2xl bg-white text-primary-100 hover:bg-white/90 font-black h-12 uppercase tracking-widest text-[11px] shadow-2xl">
                Detailed Analytics
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  glow,
}: {
  title: string,
  value: string,
  description: string,
  icon: React.ReactNode,
  color: string,
  glow: string
}) {
  return (
    <Card className={cn(
      "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 group-hover:rotate-12 transition-transform duration-500", color, glow)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2 relative z-10">
        <div className={cn("text-3xl font-black tracking-tighter mb-1 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent")}>{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4">{description}</p>
        <div className="h-1 w-full bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full opacity-80", color.replace('text', 'bg'))} style={{ width: '85%' }} />
        </div>
      </CardContent>
      {/* Decorative ghost icon */}
      <div className={cn("absolute -bottom-6 -right-6 opacity-5 group-hover:scale-110 transition-transform duration-700", color)}>
        {icon}
      </div>
    </Card>
  )
}

const upcomingAssignments = [
  {
    id: 1,
    title: "Linear Algebra Problem Set",
    course: "Mathematics Node (MATH-201)",
    assignedDate: "May 5, 2025",
    dueDate: "May 15, 2025",
    points: "100",
    status: "Processing",
    statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    progress: "60%",
    bgColor: "bg-blue-500/10",
    icon: <Calendar className="h-6 w-6 text-blue-500" />,
  },
  {
    id: 2,
    title: "Algorithm Design Challenge",
    course: "Computing Hub (CS-302)",
    assignedDate: "May 8, 2025",
    dueDate: "May 18, 2025",
    points: "150",
    status: "High Priority",
    statusColor: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-neon-primary",
    progress: "15%",
    bgColor: "bg-purple-500/10",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
  },
  {
    id: 3,
    title: "Physics Lab Integration",
    course: "Physics Sector (PHY-101)",
    assignedDate: "May 1, 2025",
    dueDate: "May 12, 2025",
    points: "75",
    status: "Imminent",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    progress: "80%",
    bgColor: "bg-amber-500/10",
    icon: <Clock className="h-6 w-6 text-amber-500" />,
  },
  {
    id: 4,
    title: "Geopolitical Impact Essay",
    course: "Arts Wing (ENG-150)",
    assignedDate: "April 25, 2025",
    dueDate: "May 10, 2025",
    points: "100",
    status: "Elapsed",
    statusColor: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-neon-danger",
    progress: "50%",
    bgColor: "bg-rose-500/10",
    icon: <AlertTriangle className="h-6 w-6 text-rose-500" />,
  },
]

const completedAssignments = [
  {
    id: 1,
    title: "Calculus Matrix Set",
    course: "Mathematics Node",
    dueDate: "April 28, 2025",
    submittedDate: "Apr 27",
    grade: "92 / 100",
    status: "Verified",
    statusColor: "text-emerald-500",
  },
  {
    id: 2,
    title: "Data Analytics Logic",
    course: "Computing Hub",
    dueDate: "April 25, 2025",
    submittedDate: "Apr 24",
    grade: "88 / 100",
    status: "Verified",
    statusColor: "text-emerald-500",
  },
  {
    id: 3,
    title: "Mechanics Sector Report",
    course: "Physics Sector",
    dueDate: "April 20, 2025",
    submittedDate: "Apr 19",
    grade: "95 / 100",
    status: "Verified",
    statusColor: "text-emerald-500",
  },
  {
    id: 4,
    title: "Shakespeare Logic Analysis",
    course: "Arts Wing",
    dueDate: "April 15, 2025",
    submittedDate: "Apr 15",
    grade: "85 / 100",
    status: "Verified",
    statusColor: "text-emerald-500",
  },
  {
    id: 5,
    title: "Asynchronous Interaction Quiz",
    course: "Computing Hub",
    dueDate: "April 10, 2025",
    submittedDate: "Apr 10",
    grade: "90 / 100",
    status: "Verified",
    statusColor: "text-emerald-500",
  },
]
