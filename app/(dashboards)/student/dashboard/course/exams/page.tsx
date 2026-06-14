'use client'

import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Download,
  ShieldCheck,
  Zap,
  Star,
  BookOpen,
  ChevronRight,
  GraduationCap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function ExamsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 border border-primary-100/20 text-[10px] font-black text-primary-100 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Evaluation Protocol
          </div>
          <TextGenerateEffect
            words="Summative Assessments"
            className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl">
            View and prepare for your upcoming institutional examinations with real-time temporal tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none h-12 min-w-[160px] appearance-none cursor-pointer">
            <option>Current Semester</option>
            <option>Previous Semester</option>
          </select>
          <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Preparation Node
          </Button>
        </div>
      </div>

      {/* Roster Filtration */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden mb-8">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[280px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="QUERY ASSESSMENT..."
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-xs font-black uppercase tracking-widest"
                />
              </div>
            </div>
            <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8">
              <Filter className="h-4 w-4 mr-2" />
              Filter Curriculum
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Upcoming Evaluations</h2>
          <Badge variant="glass" className="font-black text-[9px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-3 uppercase tracking-widest">Active Schedule</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>

      {/* Legacy Evaluatives */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Historical Chronicle</h2>
          <Badge variant="glass" className="font-black text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 uppercase tracking-widest">Verified Completion</Badge>
        </div>
        <Card className="border-white/10 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Course Module</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Temporal Marker</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deployment</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pastExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-white/10 transition-all group">
                    <td className="px-8 py-5">
                      <span className="font-black text-xs uppercase tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">{exam.course}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{exam.date}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{exam.time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 opacity-60">
                        <MapPin className="w-3 h-3 text-primary-100" />
                        <span className="text-[9px] font-black uppercase text-muted-foreground truncate max-w-[150px]">{exam.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Badge
                        variant="glass"
                        className={cn("px-3 py-1 font-black text-[9px] uppercase tracking-widest", getResultClass(exam.result))}
                      >
                        {exam.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Resource Nodes */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary-100 italic">Preparation Assets</h2>
          <Badge variant="glass" className="font-black text-[9px] bg-indigo-500/10 text-indigo-500 border-indigo-500/20 px-3 uppercase tracking-widest">Institutional Resources</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {examResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamCard({ exam }: any) {
  return (
    <Card className="group border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary-100/10 transition-all duration-500 relative">
      <div className={cn("h-2 w-full", getExamTypeColor(exam.type))}></div>
      <div className="p-8 space-y-6">
        <div>
          <h3 className="font-black text-xl tracking-tighter uppercase mb-2 group-hover:text-primary-100 transition-colors">{exam.course}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed line-clamp-2">{exam.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/5">
              <Calendar className="h-4 w-4 text-primary-100" />
            </div>
            <span>{exam.date}</span>
          </div>
          <div className="flex items-center text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/5">
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
            <span>{exam.time}</span>
          </div>
          <div className="flex items-center text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/5">
              <MapPin className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="truncate">{exam.location}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-between items-center group/footer">
          <Badge variant="glass" className={cn("px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-sm", getExamTypeClass(exam.type))}>{exam.type}</Badge>
          <Button variant="ghost" className="h-9 rounded-xl font-black uppercase text-[10px] tracking-widest text-primary-100 group/btn">
            Initialization Logic
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      {/* Ghost Icon background */}
      <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Zap size={140} className="text-primary-100" />
      </div>
    </Card>
  )
}

function ResourceCard({ resource }: any) {
  return (
    <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:bg-white/50 transition-all duration-300 group">
      <CardContent className="p-8">
        <div className="flex items-center gap-5 mb-5">
          <div className="rounded-2xl p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-base uppercase tracking-tight">{resource.title}</h3>
            <Badge variant="glass" className="text-[7px] font-black uppercase tracking-widest mt-1 bg-white/10">{resource.type}</Badge>
          </div>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8 leading-relaxed">{resource.description}</p>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5 opacity-40">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-[8px] font-black uppercase tracking-widest">Recommended Node</span>
          </div>
          <Button variant="premium" className="h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest shadow-neon-primary group/dl">
            <Download className="h-3.5 w-3.5 mr-2 group-hover/dl:animate-bounce" />
            Retrieve Asset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getExamTypeColor(type: string) {
  switch (type) {
    case "Final Exam":
      return "bg-rose-500 shadow-neon-danger"
    case "Midterm":
      return "bg-amber-500 shadow-md"
    case "Quiz":
      return "bg-emerald-500 shadow-neon-emerald"
    default:
      return "bg-primary-100 shadow-neon-primary"
  }
}

function getExamTypeClass(type: string) {
  switch (type) {
    case "Final Exam":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-neon-danger"
    case "Midterm":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    case "Quiz":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald"
    default:
      return "bg-primary-100/10 text-primary-100 border-primary-100/20 shadow-neon-primary"
  }
}

function getResultClass(result: string) {
  if (result.startsWith("A")) {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald"
  } else if (result.startsWith("B")) {
    return "bg-primary-100/10 text-primary-100 border-primary-100/20"
  } else if (result.startsWith("C")) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  } else {
    return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-neon-danger"
  }
}

const upcomingExams = [
  {
    id: 1,
    course: "CS301: Data Structures",
    description: "Comprehensive exam covering all topics from the semester iteration",
    date: "June 15, 2025",
    time: "10:00 AM — 12:00 PM",
    location: "Hub 302, Computing Sector",
    type: "Final Exam",
  },
  {
    id: 2,
    course: "MATH201: Calculus II",
    description: "Evaluative covering integration techniques and multi-dimensional hub applications",
    date: "June 10, 2025",
    time: "02:00 PM — 04:00 PM",
    location: "Sector 105, Mathematical Wing",
    type: "Final Exam",
  },
  {
    id: 3,
    course: "PHYS101: Intro Physics",
    description: "Synchronized evaluation on mechanics and spatial motion heuristics",
    date: "May 30, 2025",
    time: "11:00 AM — 12:00 PM",
    location: "Sector 201, Science Hub",
    type: "Quiz",
  },
]

const pastExams = [
  {
    id: 1,
    course: "CS201: Programming Fund.",
    date: "April 20, 2025",
    time: "10:00 AM — 12:00 PM",
    location: "Hub 302, Computing Sector",
    result: "A+",
  },
  {
    id: 2,
    course: "MATH101: Calculus I",
    date: "April 15, 2025",
    time: "02:00 PM — 04:00 PM",
    location: "Sector 105, Mathematical Wing",
    result: "B+",
  },
  {
    id: 3,
    course: "ENG101: English Comp.",
    date: "April 5, 2025",
    time: "09:00 AM — 11:00 AM",
    location: "Sector 201, Arts Sector",
    result: "A",
  },
  {
    id: 4,
    course: "HIST101: World History",
    date: "March 25, 2025",
    time: "01:00 PM — 03:00 PM",
    location: "Sector 301, Arts Sector",
    result: "B",
  },
]

const examResources = [
  {
    id: 1,
    title: "CS301 Structural Guide",
    description: "Comprehensive heuristic guide for the Data Structures final evaluation node",
    type: "Institutional Node (PDF)",
  },
  {
    id: 2,
    title: "MATH201 Logic Problems",
    description: "Collection of practice logic sets for Calculus II with verified solution nodes",
    type: "Institutional Node (PDF)",
  },
  {
    id: 3,
    title: "PHYS101 Formula Matrix",
    description: "Essential formula matrices and heuristic equations for the Physics node",
    type: "Institutional Node (PDF)",
  },
]
