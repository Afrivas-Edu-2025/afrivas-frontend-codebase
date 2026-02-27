'use client'

import {
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Activity,
  Zap,
  Star,
  Sparkles,
  Award,
  Clock,
  BookOpen,
  Target,
  ArrowRight,
  TrendingDown,
  Layers
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function AcademicInsightsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-black text-primary-100 uppercase tracking-[0.2em]">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Performance Telemetry
          </div>
          <TextGenerateEffect
            words="Strategic Analytics"
            className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl">
            A comprehensive diagnostic overview of your scholastic trajectory and behavioral heuristics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
            Neural Sync
          </Button>
          <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Generate Prediction
          </Button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Consolidated GPA"
          value="3.8"
          trend="+0.2 Increase"
          trendIcon={<TrendingUp className="h-3 w-3" />}
          trendColor="text-emerald-500"
          icon={<Award className="h-4 w-4" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
        />
        <SummaryCard
          title="Presence Index"
          value="92.5%"
          trend="+3.2% Upshift"
          trendIcon={<TrendingUp className="h-3 w-3" />}
          trendColor="text-emerald-500"
          icon={<Activity className="h-4 w-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
        />
        <SummaryCard
          title="Deliverable Rate"
          value="85%"
          trend="-2.1% Deviation"
          trendIcon={<TrendingDown className="h-3 w-3" />}
          trendColor="text-rose-500"
          icon={<Target className="h-4 w-4" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
        />
        <SummaryCard
          title="Global Ranking"
          value="12/120"
          trend="Top 10th Percentile"
          icon={<Star className="h-4 w-4" />}
          color="text-indigo-500"
          glow="shadow-indigo-500/10"
        />
      </div>

      {/* Core Heuristics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group">
          <CardHeader className="p-8 border-b border-white/5 bg-white/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary-100">GPA Progression</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Temporal analysis of academic index</CardDescription>
            </div>
            <Badge variant="glass" className="bg-primary-100/10 text-primary-100 border-primary-100/20 px-3 uppercase tracking-widest font-black text-[8px]">Index: 4.0 Max</Badge>
          </CardHeader>
          <CardContent className="p-8 h-80 relative">
            <GPATrendChart />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/20 dark:from-slate-900/40 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group">
          <CardHeader className="p-8 border-b border-white/5 bg-white/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500">Curriculum Heuristics</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Node performance by subject sector</CardDescription>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-500 opacity-40 animate-pulse" />
          </CardHeader>
          <CardContent className="p-8 h-80">
            <SubjectPerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DiagnosticsCard
          title="Presence Audit"
          description="Institutional attendance mapping"
          icon={<Activity className="w-4 h-4 text-emerald-500" />}
          value="92.5%"
          color="emerald"
        >
          <AttendanceChartComponent />
        </DiagnosticsCard>

        <DiagnosticsCard
          title="Deliverable Logic"
          description="Assignment completion heuristic"
          icon={<Target className="w-4 h-4 text-primary-100" />}
          value="85%"
          color="primary"
        >
          <AssignmentCompletionChartComponent />
        </DiagnosticsCard>

        <DiagnosticsCard
          title="Temporal Allocation"
          description="Resource distribution by node"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
          value="46hr/wk"
          color="amber"
          noChartPadding
        >
          <StudyTimeChartComponent />
        </DiagnosticsCard>
      </div>

      {/* Mastery Index */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        <CardHeader className="p-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black uppercase tracking-[0.2em] text-primary-100">Valuation by Assessment Node</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Weighted metric breakdown by evaluation category</CardDescription>
          </div>
          <Button variant="ghost" className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest text-primary-100 hover:bg-primary-100/10">
            Audit Detailed Log
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-4 gap-10">
          <PerformanceCategory title="Summative Exams" score="92%" color="bg-primary-100 shadow-neon-primary" icon={<Award className="w-3.5 h-3.5" />} />
          <PerformanceCategory title="Deliverables" score="85%" color="bg-emerald-500 shadow-neon-emerald" icon={<Target className="w-3.5 h-3.5" />} />
          <PerformanceCategory title="Project Nodes" score="88%" color="bg-indigo-500" icon={<Layers className="w-3.5 h-3.5" />} />
          <PerformanceCategory title="Micro-Evaluations" score="78%" color="bg-amber-500" icon={<Zap className="w-3.5 h-3.5" />} />
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({ title, value, trend, trendIcon, trendColor, icon, color, glow }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform active:scale-95 group-hover:rotate-6", color, glow)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-black tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{value}</div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={cn("text-[9px] font-black uppercase tracking-widest", trendColor)}>{trend}</span>
          {trendIcon && <div className={trendColor}>{trendIcon}</div>}
        </div>
        <div className="mt-4 h-1 w-full bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full opacity-80", color.replace('text', 'bg'))} style={{ width: '85%' }} />
        </div>
      </CardContent>
    </Card>
  )
}

function DiagnosticsCard({ title, description, icon, value, color, children, noChartPadding }: any) {
  return (
    <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl group">
      <CardHeader className="p-6 border-b border-white/5 bg-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/5">
            {icon}
          </div>
          <span className={cn("text-lg font-black italic", color === 'emerald' ? 'text-emerald-500' : color === 'primary' ? 'text-primary-100' : 'text-amber-500')}>{value}</span>
        </div>
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">{title}</CardTitle>
        <CardDescription className="text-[8px] font-bold uppercase tracking-widest opacity-60">{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn("p-6 flex items-center justify-center min-h-[220px]", noChartPadding && "px-8 py-4 items-start")}>
        {children}
      </CardContent>
    </Card>
  )
}

function PerformanceCategory({ title, score, color, icon }: any) {
  const percentage = Number.parseInt(score)

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 opacity-60 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary-100 transition-colors">{title}</h3>
        </div>
        <span className="text-xs font-black tracking-tighter">{score}</span>
      </div>
      <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function GPATrendChart() {
  return (
    <div className="w-full h-full relative p-4">
      <div className="absolute inset-0 border-l border-b border-white/10">
        {/* Simplified Aesthetic Chart */}
        <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 5 80 L 25 70 L 50 60 L 75 40 L 95 20"
            fill="none"
            stroke="url(#gpaGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          <path
            d="M 5 80 L 25 70 L 50 60 L 75 40 L 95 20 L 95 100 L 5 100 Z"
            fill="url(#gpaArea)"
            opacity="0.1"
          />
          <defs>
            <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gpaArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-[-24px] left-0 w-full flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          <span>ROT 01</span>
          <span>ROT 02</span>
          <span>ROT 03</span>
          <span>ACTIVE</span>
        </div>
      </div>
    </div>
  )
}

function SubjectPerformanceChart() {
  const subjects = [
    { name: "MATH", score: 92, color: "bg-primary-100 shadow-neon-primary" },
    { name: "CS", score: 88, color: "bg-indigo-500 shadow-lg" },
    { name: "PHYS", score: 76, color: "bg-amber-500" },
    { name: "LIT", score: 85, color: "bg-emerald-500" },
    { name: "GEO", score: 79, color: "bg-rose-500" },
  ]

  return (
    <div className="w-full h-full flex items-end justify-around gap-4 px-2">
      {subjects.map((subject, index) => (
        <div key={index} className="flex-1 flex flex-col items-center group/bar">
          <div className="relative w-full flex flex-col items-center">
            <div
              className={cn("w-10 rounded-t-xl transition-all duration-700 group-hover/bar:scale-x-110", subject.color)}
              style={{ height: `${subject.score * 1.8}px` }}
            />
            <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[8px] font-black">{subject.score}%</div>
          </div>
          <p className="text-[10px] font-black mt-4 text-muted-foreground tracking-widest">{subject.name}</p>
        </div>
      ))}
    </div>
  )
}

function AttendanceChartComponent() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
            strokeDasharray="263.8"
            strokeDashoffset="19.8"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="drop-shadow-neon-emerald"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black italic tracking-tighter">92.5%</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Synchronized</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[8px] font-bold uppercase text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[8px] font-bold uppercase text-muted-foreground">Excused</span>
        </div>
      </div>
    </div>
  )
}

function AssignmentCompletionChartComponent() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeDasharray="263.8"
            strokeDashoffset="39.6"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="drop-shadow-neon-primary"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black italic tracking-tighter">85%</span>
          <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Verified</span>
        </div>
      </div>
      <div className="flex gap-4">
        <Badge variant="glass" className="text-[7px] font-black uppercase tracking-widest border-primary-100/20 text-primary-100">Deliverables Meta</Badge>
      </div>
    </div>
  )
}

function StudyTimeChartComponent() {
  const subjects = [
    { name: "COMPUTING", hours: 15, color: "bg-primary-100 shadow-neon-primary" },
    { name: "MATHEMATICS", hours: 12, color: "bg-indigo-500" },
    { name: "PHYSICS NODE", hours: 8, color: "bg-amber-500" },
    { name: "LINGUISTICS", hours: 6, color: "bg-emerald-500" },
    { name: "HISTORY HUB", hours: 5, color: "bg-rose-500" },
  ]
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0)

  return (
    <div className="w-full h-full flex flex-col justify-center space-y-4">
      {subjects.map((subject, index) => (
        <div key={index} className="space-y-1.5 group">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary-100 transition-colors">{subject.name}</span>
            <span className="text-[9px] font-black italic tracking-tighter">{subject.hours}HR</span>
          </div>
          <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-1000 ease-out", subject.color)}
              style={{ width: `${(subject.hours / totalHours) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
