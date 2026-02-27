'use client'

import {
  Calendar,
  Clock,
  FileText,
  Award,
  TrendingUp,
  Filter,
  Search,
  BookOpen,
  ChevronRight,
  Zap,
  Star,
  Sparkles,
  ArrowRight
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

export default function AssessmentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-primary-100" />
              Academic Performance
            </span>
          </div>
          <TextGenerateEffect
            words="Academic Assessments"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Track your evaluations and milestone achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
            View GPA Trends
          </Button>
          <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Performance Report
          </Button>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="INSTITUTIONAL EVALUATIONS"
          value="28"
          description="Assigned this trimester"
          icon={<FileText className="h-4 w-4 text-primary-100" />}
          color="from-primary-100/10 to-transparent border-primary-100/20"
          valueColor="text-primary-100"
          trend="8 Scheduled"
        />
        <SummaryCard
          title="VERIFIED COMPLETIONS"
          value="22"
          description="78.6% Milestone Progress"
          icon={<Award className="h-4 w-4 text-emerald-500" />}
          color="from-emerald-500/10 to-transparent border-emerald-500/20"
          valueColor="text-emerald-500"
          trend="+4 since last week"
        />
        <SummaryCard
          title="PENDING MILESTONES"
          value="04"
          description="Critical due within 7 days"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          color="from-amber-500/10 to-transparent border-amber-500/20"
          valueColor="text-amber-500"
          trend="Action Required"
        />
        <SummaryCard
          title="SCHOLASTIC INDEX"
          value="87.5%"
          description="Performing in Top 10th Percentile"
          icon={<TrendingUp className="h-4 w-4 text-indigo-500" />}
          color="from-indigo-500/10 to-transparent border-indigo-500/20"
          valueColor="text-indigo-500"
          trend="Superior Standing"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Assessments */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Live Evaluations</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Current and upcoming academic hurdles</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary-100/10 text-primary-100">
                <ChevronRight size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {upcomingAssessments.map((assessment) => (
                  <div key={assessment.id} className="p-6 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border backdrop-blur-md shadow-lg transition-transform duration-500 group-hover:rotate-6",
                        assessment.bgColor.replace('bg-', 'bg-').replace('-100', '/10'),
                        "border-white/20"
                      )}>
                        {assessment.icon}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-black uppercase tracking-tight text-gray-800 dark:text-gray-100">{assessment.title}</h3>
                              <Badge variant="glass" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5", assessment.statusColor.replace('bg-', 'bg-').replace('-100', '/10'))}>
                                {assessment.status}
                              </Badge>
                            </div>
                            <p className="text-xs font-bold text-primary-100 uppercase tracking-widest flex items-center gap-1.5">
                              <BookOpen className="w-3 h-3" />
                              {assessment.course}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80">{assessment.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80">{assessment.duration}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-3xl border-l-2 border-primary-100/20 pl-4">
                          {assessment.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Weight: {assessment.weight}</span>
                          </div>
                          <Button variant="premium" className="rounded-xl px-5 h-10 text-[10px] font-black uppercase tracking-widest">
                            Synchronize Details
                            <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Filters & Performance Insights */}
        <div className="lg:col-span-4 space-y-8">
          {/* Enhanced Filtration */}
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="p-6 border-b border-white/10">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-100" />
                Roster Filtration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="relative group">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Search Evaluations..."
                  className="h-12 pl-11 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Institutional Course</label>
                <select className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl text-xs font-bold uppercase tracking-tight shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none appearance-none">
                  <option value="all">Comprehensive Analysis</option>
                  <option value="math">Mathematics (MATH-201)</option>
                  <option value="cs">Computer Science (CS-302)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Evaluation Category</label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {["Quiz", "Test", "Project", "Seminar"].map(type => (
                    <Badge key={type} variant="glass" className="cursor-pointer hover:bg-primary-100/20 transition-all px-3 py-2 font-black uppercase tracking-widest text-[9px] justify-center">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="premium" className="w-full rounded-2xl py-6 shadow-neon-primary mt-4 font-black uppercase tracking-widest text-[10px]">
                Apply Scholastic Filters
              </Button>
            </CardContent>
          </Card>

          {/* Performance Insight Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-500 border-none shadow-lg shadow-indigo-500/20 text-white rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <Award size={140} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Achievement Pulse</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-black mb-1">Superior Marksman</h3>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Achieved 'A' grade in 85% of latest logs</p>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest h-8">
                  Review Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evaluation History Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-white/10 bg-white/10 dark:bg-slate-900/10">
          <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Institutional History</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Full chronological trace of academic verified logs</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/10 dark:bg-slate-900/10">
                <TableRow className="border-white/10">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-5">Assessment Handle</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Descriptor</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temporal Mark</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Score</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scholastic Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentHistory.map((assessment) => (
                  <TableRow key={assessment.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group">
                    <TableCell className="py-5">
                      <div className="text-xs font-black uppercase tracking-tight text-gray-800 dark:text-gray-100">{assessment.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{assessment.course}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 whitespace-nowrap", getTypeColor(assessment.type))}>
                        {assessment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-80">{assessment.date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-black tracking-tighter text-primary-100">{assessment.score}</div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black border shadow-sm",
                        getGradeColor(assessment.grade)
                      )}>
                        {assessment.grade}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-6 bg-white/5 border-t border-white/5">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Verification Ledger: <span className="text-primary-100">Showing Latest Archive</span>
            </div>
            <Button variant="ghost" className="rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-100/10">
              Access Full Archives
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
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
      color.includes("border") ? color : "border-white/20 dark:border-slate-800/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className="p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20">{icon}</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className={cn("text-3xl font-black tracking-tighter mb-1", valueColor)}>{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-1 flex-1 bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden mr-3">
            <div className={cn("h-full rounded-full opacity-80", valueColor.replace('text', 'bg'))} style={{ width: '75%' }} />
          </div>
          <span className="text-[8px] font-black text-primary-100 uppercase whitespace-nowrap px-2 py-0.5 rounded-md bg-primary-100/10">{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getTypeColor(type: string) {
  switch (type) {
    case "Quiz":
      return "border-blue-500/30 text-blue-500"
    case "Test":
      return "border-purple-500/30 text-purple-500"
    case "Project":
      return "border-emerald-500/30 text-emerald-500"
    case "Presentation":
      return "border-amber-500/30 text-amber-500"
    default:
      return "border-gray-500/30 text-gray-500"
  }
}

function getGradeColor(grade: string) {
  if (grade.startsWith("A")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
  if (grade.startsWith("B")) return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10"
  if (grade.startsWith("C")) return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10"
  if (grade.startsWith("D")) return "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-orange-500/10"
  if (grade.startsWith("F")) return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10"
  return "bg-gray-100/10 text-gray-500 border-gray-100/20"
}

const upcomingAssessments = [
  {
    id: 1,
    title: "Midterm Examination",
    course: "Computer Science (CS-301)",
    dueDate: "May 25, 2025",
    duration: "2 hours",
    weight: "30%",
    status: "Upcoming",
    statusColor: "bg-blue-500/20 text-blue-100",
    description: "Comprehensive exam covering advanced algorithms, data structure complexity analysis, and graph theory implementations.",
    bgColor: "bg-indigo-500",
    icon: <FileText className="h-6 w-6 text-indigo-500" />,
  },
  {
    id: 2,
    title: "Project Presentation",
    course: "Mathematics (MATH-202)",
    dueDate: "May 28, 2025",
    duration: "15 minutes",
    weight: "25%",
    status: "Preparation",
    statusColor: "bg-amber-500/20 text-amber-100",
    description: "Detailed presentation of research findings regarding linear algebra applications in modern cryptographical systems.",
    bgColor: "bg-emerald-500",
    icon: <Award className="h-6 w-6 text-emerald-500" />,
  },
]

const assessmentHistory = [
  {
    id: 1,
    title: "Quiz 3: Logic Loops",
    course: "Computer Science",
    type: "Quiz",
    date: "May 10, 2025",
    score: "18/20",
    grade: "A-",
  },
  {
    id: 2,
    title: "Calculus Test 2",
    course: "Mathematics",
    type: "Test",
    date: "May 05, 2025",
    score: "85/100",
    grade: "B+",
  },
  {
    id: 3,
    title: "Lab Report: Motion",
    course: "Physics",
    type: "Project",
    date: "Apr 28, 2025",
    score: "92/100",
    grade: "A",
  },
  {
    id: 4,
    title: "Essay: Modern Lit",
    course: "English",
    type: "Project",
    date: "Apr 20, 2025",
    score: "88/100",
    grade: "B+",
  },
]
