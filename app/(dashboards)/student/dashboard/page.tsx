'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  LineChart,
  Star,
  Zap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowRight
} from "lucide-react"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function StudentDashboard() {
  const statCards = [
    { title: "Courses Enrolled", value: "06", icon: BookOpen, desc: "Active Curriculum", color: "text-indigo-500", glow: "shadow-indigo-500/10", trend: "+2 this term" },
    { title: "Milestone Tasks", value: "12", icon: FileText, desc: "Pending Evaluations", color: "text-primary-100", glow: "shadow-primary-100/10", trend: "3 critical" },
    { title: "Attendance Index", value: "92%", icon: CheckCircle, desc: "Scholastic Presence", color: "text-emerald-500", glow: "shadow-emerald-500/10", trend: "Superior Standing" },
    { title: "Scholastic Ranking", value: "3.8", icon: Award, desc: "Cumulative Grade", color: "text-amber-500", glow: "shadow-amber-500/10", trend: "Top 15th Percentile" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-black text-primary-100 uppercase tracking-[0.2em]">
            <Star className="w-3 h-3 mr-1.5 fill-primary-100" />
            Scholastic Command Center
          </div>
          <TextGenerateEffect
            words="Strategic Overview"
            className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl">
            Salutations, Alex. Your academic trajectory is currently projected at
            <span className="text-primary-100 font-bold mx-1 text-base uppercase tracking-tight">Optimal Capacity</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
            Full Archive
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-6 shadow-neon-primary group h-12">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Insight Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <SummaryCard key={idx} {...card} />
        ))}
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="courses" className="space-y-8">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/50 p-1.5 rounded-2xl h-16 shadow-inner">
            <TabsTrigger value="courses" className="rounded-xl px-10 h-full data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em]">Curriculum</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-xl px-10 h-full data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em]">Daily Chrono</TabsTrigger>
            <TabsTrigger value="progress" className="rounded-xl px-10 h-full data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em]">Analytics</TabsTrigger>
          </TabsList>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
            <Clock className="w-3.5 h-3.5 text-primary-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Term progression: 64%</span>
          </div>
        </div>

        {/* Tab: Curriculum */}
        <TabsContent value="courses" className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Advanced Computer Science",
                progress: 75,
                instructor: "Dr. Sarah Johnson",
                nextClass: "Tomorrow, 10:00 AM",
                icon: <BookOpen className="h-6 w-6" />,
                accentColor: "text-indigo-500",
                bgGradient: "from-indigo-500/10 to-transparent"
              },
              {
                title: "Calculus & Linear Systems",
                progress: 60,
                instructor: "Prof. Michael Chen",
                nextClass: "Today, 02:00 PM",
                icon: <LineChart className="h-6 w-6" />,
                accentColor: "text-emerald-500",
                bgGradient: "from-emerald-500/10 to-transparent"
              },
              {
                title: "Modern World Geopolitics",
                progress: 45,
                instructor: "Dr. Emily Rodriguez",
                nextClass: "Wednesday, 11:30 AM",
                icon: <Calendar className="h-6 w-6" />,
                accentColor: "text-amber-500",
                bgGradient: "from-amber-500/10 to-transparent"
              },
              {
                title: "Biological Synthetics",
                progress: 30,
                instructor: "Prof. David Kim",
                nextClass: "Friday, 09:00 AM",
                icon: <GraduationCap className="h-6 w-6" />,
                accentColor: "text-rose-500",
                bgGradient: "from-rose-500/10 to-transparent"
              },
            ].map((course, i) => (
              <CourseCard key={i} {...course} />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Daily Chrono */}
        <TabsContent value="schedule" className="animate-in slide-in-from-bottom-4 duration-700">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/20">
              <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Synchronized Schedule</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Real-time scholastic timeline for the current rotation</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 bg-white/5 dark:bg-slate-900/10">
                {["Monday", "Tuesday", "Wednesday"].map((day) => (
                  <div key={day} className="p-8 space-y-6 hover:bg-white/10 transition-colors">
                    <h3 className="text-[10px] font-black text-primary-100 uppercase tracking-[0.3em] pl-2 border-l-2 border-primary-100">{day}</h3>
                    <div className="grid gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/30 dark:bg-slate-800/40 backdrop-blur-sm border border-white/10 dark:border-slate-700/50 rounded-2xl group hover:border-primary-100/30 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="p-3 bg-white/40 dark:bg-slate-900/50 rounded-xl border border-white/10 group-hover:shadow-neon-primary transition-all duration-500">
                              <Clock className="w-5 h-5 text-primary-100" />
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase tracking-tight text-gray-800 dark:text-gray-100">Advanced Computer Science</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">Lab Integration • Sector 101</p>
                            </div>
                          </div>
                          <div className="text-[10px] font-black text-primary-100 uppercase tracking-widest px-4 py-2 rounded-xl bg-primary-100/10 border border-primary-100/20">
                            10:00 — 11:30 AM
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/10 text-center border-t border-white/5">
                <Button variant="ghost" className="rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-100/10 text-primary-100">
                  Expand Temporal Calendar
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Analytics */}
        <TabsContent value="progress" className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Performance Metrics</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Diagnostic visualization of academic trajectory</CardDescription>
              </div>
              <Button variant="outline" className="h-10 rounded-xl border-white/20 font-black uppercase text-[10px] tracking-widest px-4">
                Generate PDF
              </Button>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0">
              <div className="h-[400px] flex items-center justify-center bg-primary-100/5 dark:bg-primary-100/10 rounded-3xl border border-dashed border-primary-100/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <LineChart className="h-8 w-8 text-primary-100" />
                  </div>
                  <span className="text-xs font-black text-primary-100/70 block uppercase tracking-[0.3em]">Telemetry Visualization Required</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <InformationalList
              title="Critical Milestones"
              icon={<FileText className="w-5 h-5 text-amber-500" />}
              items={[
                { label: "Research Paper: Topic Analysis", meta: "Due in 48 hours", color: "text-amber-500" },
                { label: "Algorithms Milestone Evaluation", meta: "Due in 72 hours", color: "text-amber-500" }
              ]}
            />
            <InformationalList
              title="Verified Achievements"
              icon={<Award className="w-5 h-5 text-emerald-500" />}
              items={[
                { label: "Superior Performance Certificate", meta: "Awarded May 2025", color: "text-emerald-500" },
                { label: "Term GPA Target Restored", meta: "Achieved Index 3.8", color: "text-emerald-500" }
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon, desc, color, glow, trend }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700", color)}>
        <Icon size={120} />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform active:scale-95", glow)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-black tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 opacity-80">{desc}</p>
        <div className="h-1 w-full bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full opacity-80", color.replace('text', 'bg'))} style={{ width: '85%' }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[8px] font-black text-primary-100 uppercase tracking-widest">{trend}</span>
          <TrendingUp className="w-3 h-3 text-emerald-500 opacity-60" />
        </div>
      </CardContent>
    </Card>
  )
}

function CourseCard({ title, progress, instructor, nextClass, icon, accentColor, bgGradient }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 relative">
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br", bgGradient)} />
      <CardHeader className="flex flex-row items-center gap-5 relative z-10">
        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-500">
          {icon && <div className={accentColor}>{icon}</div>}
        </div>
        <div>
          <CardTitle className="text-lg font-black uppercase tracking-tight leading-tight">{title}</CardTitle>
          <CardDescription className="font-bold text-primary-100 text-[10px] uppercase tracking-[0.15em] mt-1">{instructor}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black">
            <span className="text-muted-foreground uppercase tracking-widest">Mastery Index</span>
            <span className={cn(accentColor)}>{progress}%</span>
          </div>
          <div className="relative h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-lg", accentColor.replace('text', 'bg'))}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-100/5 dark:bg-primary-100/10 border border-primary-100/10 shadow-sm">
            <Clock className="h-3 w-3 text-primary-100" />
            <span className="text-[9px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{nextClass}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary-100/10 text-primary-100 group/btn">
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function InformationalList({ title, icon, items }: any) {
  return (
    <Card className="border-white/20 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
      <CardHeader className="p-6 border-b border-white/5 bg-white/10">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-primary-100">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-5 group">
              <div className="w-1.5 h-10 rounded-full bg-white/10 dark:bg-white/5 relative overflow-hidden mt-1">
                <div className={cn("absolute inset-0 opacity-40", item.color.replace('text', 'bg'))} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm uppercase tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">{item.label}</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {item.meta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
