'use client'

import {
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Activity,
  Award,
  BookOpen,
  PieChart,
  Sparkles,
  ArrowRight,
  History,
  CheckCircle,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function GradesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3 h-3" />
              Academic Performance Node
            </span>
          </div>
          <TextGenerateEffect
            words="Scholastic Evaluatives"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Audit your learning progression and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
            Export Transcript
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Performance Insight
          </Button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Consolidated GPA"
          value="3.8"
          description="Index Upper Limit: 4.0"
          icon={<TrendingUp className="h-4 w-4" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
        />
        <SummaryCard
          title="Scholastic Credits"
          value="45"
          description="+15 Incremental this rotation"
          icon={<BarChart3 className="h-4 w-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
        />
        <SummaryCard
          title="Institutional Rank"
          value="12/120"
          description="Top 10th Percentile Node"
          icon={<Activity className="h-4 w-4" />}
          color="text-indigo-500"
          glow="shadow-indigo-500/10"
        />
      </div>

      {/* Roster Filtration */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Query course performance..."
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100 font-bold uppercase text-[10px] tracking-widest h-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none h-10 min-w-[160px] appearance-none cursor-pointer">
                <option value="current">Active Cycle</option>
                <option value="previous">Previous Cycle</option>
                <option value="all">Global History</option>
              </select>

              <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-black uppercase tracking-[0.2em] text-[10px] h-10 px-6">
                <Filter className="h-4 w-4 mr-2" />
                Initialize Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Grades Table */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Active Cycle Evaluations
                </CardTitle>
              </div>
              <Badge variant="glass" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[8px] uppercase tracking-[0.2em] px-3">Sync Status: Optimal</Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Course Node</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Credits</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Valuation</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Index</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentSemesterGrades.map((course) => (
                    <tr key={course.id} className="hover:bg-white/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-black text-xs uppercase tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">{course.name}</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{course.code} • {course.instructor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[10px] font-black border-white/20">{course.credits}U</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-xs font-black uppercase ${getGradeColor(course.grade)} group-hover:scale-110 transition-transform origin-left`}>{course.grade}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-xs text-muted-foreground">{course.gpa}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="glass" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-1", getStatusColor(course.status))}>
                          {course.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-100 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Valuation Spectrum
                </h3>
                <div className="flex items-center gap-1 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Live Heuristic</span>
                </div>
              </div>
              <div className="h-56 relative border border-white/5 rounded-2xl bg-white/5">
                <GradeDistributionChart />
              </div>
            </Card>

            <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Temporal Indexing
                </h3>
                <Badge variant="glass" className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5">+4.2% Growth</Badge>
              </div>
              <div className="h-56 relative border border-white/5 rounded-2xl bg-white/5">
                <GPATrendChart />
              </div>
            </Card>
          </div>
        </div>

        {/* Temporal Chronicles Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Historical</h2>
            <Badge variant="glass" className="font-bold border-indigo-500/20 text-indigo-500 bg-indigo-500/5">Transcripts</Badge>
          </div>

          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/5 bg-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                Legacy Evaluations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {academicHistory.map((semester) => (
                  <div key={semester.id} className="p-6 hover:bg-primary-100/5 transition-all group cursor-pointer relative">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h4 className="text-sm font-black uppercase tracking-tighter group-hover:text-primary-100 transition-colors">{semester.name}</h4>
                      <Badge variant="glass" className={cn("text-[9px] font-black uppercase tracking-widest h-6 shadow-sm px-2", getStandingColor(semester.standing))}>
                        {semester.standing}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-muted-foreground uppercase opacity-60">Cycle GPA</span>
                          <span className="text-xs font-black text-gray-800 dark:text-gray-100">{semester.gpa}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-muted-foreground uppercase opacity-60">Cumulative</span>
                          <span className="text-xs font-black text-indigo-500">{semester.cumulativeGPA}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 group-hover:bg-primary-100/10 transition-all font-black text-[8px] text-primary-100 border border-primary-100/10">
                        VIEW TRANSCRIPT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-white/5 bg-white/5">
                <Button variant="ghost" className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-primary-100 hover:bg-primary-100 hover:text-white transition-all">
                  Audit Global History
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Alert */}
          <Card className="bg-gradient-to-br from-primary-100 to-indigo-600 border-none shadow-lg shadow-primary-100/20 text-white rounded-3xl overflow-hidden relative group p-8">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Activity size={180} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Growth Optimization
              </h4>
              <h3 className="text-3xl font-black mb-2 leading-none uppercase tracking-tighter italic">Superior Standing</h3>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest leading-relaxed">System diagnostics confirm your inclusion in the <span className="text-white bg-white/20 px-1.5 rounded">Dean's Honor List</span> for 3 consecutive cycles.</p>
              <Button className="mt-8 w-full rounded-2xl bg-white text-primary-100 hover:bg-white/90 font-black h-12 uppercase tracking-widest text-[11px] shadow-2xl">
                View Academic Transcript
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, description, icon, color, glow }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform active:scale-95", color, glow)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-black tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 opacity-80">{description}</p>
        <div className="h-1 w-full bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full opacity-80", color.replace('text', 'bg'))} style={{ width: '85%' }} />
        </div>
      </CardContent>
    </Card>
  )
}

function getGradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-500"
  if (grade.startsWith("B")) return "text-primary-100"
  if (grade.startsWith("C")) return "text-amber-500"
  if (grade.startsWith("D")) return "text-orange-500"
  if (grade.startsWith("F")) return "text-rose-500"
  return "text-muted-foreground"
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "In Progress":
      return "bg-primary-100/10 text-primary-100 border-primary-100/20 shadow-neon-primary"
    case "Pending":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getStandingColor(standing: string) {
  switch (standing) {
    case "Dean's List":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald"
    case "Good Standing":
      return "bg-primary-100/10 text-primary-100 border-primary-100/20"
    case "Academic Warning":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    case "Academic Probation":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20"
    case "In Progress":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function GradeDistributionChart() {
  const grades = [
    { grade: "A", count: 8, color: "bg-emerald-500 shadow-neon-emerald" },
    { grade: "B", count: 5, color: "bg-primary-100 shadow-neon-primary" },
    { grade: "C", count: 2, color: "bg-amber-500" },
    { grade: "D", count: 0, color: "bg-orange-500" },
    { grade: "F", count: 0, color: "bg-rose-500" },
  ]

  return (
    <div className="w-full h-full flex items-end justify-around px-4 pb-4">
      {grades.map((grade, index) => (
        <div key={index} className="flex flex-col items-center group/bar">
          <div className="relative w-10 flex flex-col items-center">
            <div
              className={cn("w-full rounded-t-xl transition-all duration-1000 group-hover/bar:scale-x-110", grade.color)}
              style={{ height: `${grade.count * 16}px` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black">{grade.count}</div>
            </div>
          </div>
          <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">{grade.grade}</p>
        </div>
      ))}
    </div>
  )
}

function GPATrendChart() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full h-full border-l-2 border-b-2 border-white/10 relative">
        {/* Simplified SVG Chart */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 5 80 L 30 60 L 60 40 L 95 20"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-lg"
          />
          <path
            d="M 5 80 L 30 60 L 60 40 L 95 20 L 95 100 L 5 100 Z"
            fill="url(#areaGradient)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Data Points */}
          <circle cx="5" cy="80" r="2.5" fill="#8b5cf6" />
          <circle cx="30" cy="60" r="2.5" fill="#8b5cf6" />
          <circle cx="60" cy="40" r="2.5" fill="#8b5cf6" />
          <circle cx="95" cy="20" r="2.5" fill="#3b82f6" className="animate-pulse" />
        </svg>

        <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest">
          <span>S1</span>
          <span>S2</span>
          <span>S3</span>
          <span className="text-primary-100">C4</span>
        </div>
      </div>
    </div>
  )
}

const currentSemesterGrades = [
  {
    id: 1,
    name: "Advanced Mathematics",
    code: "MATH 301",
    credits: 3,
    instructor: "Dr. Robert Chen",
    grade: "A",
    gpa: "4.0",
    status: "Completed",
  },
  {
    id: 2,
    name: "Object-Oriented Architecture",
    code: "CS 302",
    credits: 4,
    instructor: "Prof. Maria Garcia",
    grade: "A-",
    gpa: "3.7",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Physics Integration Node",
    code: "PHYS 101",
    credits: 4,
    instructor: "Dr. James Wilson",
    grade: "B+",
    gpa: "3.3",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Linguistic Logic Hub",
    code: "ENG 201",
    credits: 3,
    instructor: "Prof. Emily Johnson",
    grade: "A",
    gpa: "4.0",
    status: "Pending",
  },
  {
    id: 5,
    name: "Cognitive Heuristics",
    code: "PSYC 101",
    credits: 3,
    instructor: "Dr. Michael Brown",
    grade: "B",
    gpa: "3.0",
    status: "In Progress",
  },
]

const academicHistory = [
  {
    id: 1,
    name: "FALL ROTATION 2024",
    credits: 15,
    gpa: "3.8",
    cumulativeGPA: "3.8",
    standing: "Dean's List",
  },
  {
    id: 2,
    name: "SPRING ROTATION 2024",
    credits: 16,
    gpa: "3.6",
    cumulativeGPA: "3.7",
    standing: "Dean's List",
  },
  {
    id: 3,
    name: "FALL ROTATION 2023",
    credits: 14,
    gpa: "3.5",
    cumulativeGPA: "3.5",
    standing: "Good Standing",
  },
  {
    id: 4,
    name: "CURRENT (SPRING 2025)",
    credits: 17,
    gpa: "3.8",
    cumulativeGPA: "3.7",
    standing: "In Progress",
  },
]
