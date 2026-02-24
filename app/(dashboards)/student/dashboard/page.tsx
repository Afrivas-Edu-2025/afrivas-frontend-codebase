import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, CheckCircle, Clock, FileText, GraduationCap, LineChart } from "lucide-react"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function StudentDashboard() {
  const statCards = [
    { title: "Courses Enrolled", value: "6", icon: BookOpen, desc: "2 courses in progress", color: "from-blue-500 to-cyan-500" },
    { title: "Assignments", value: "12", icon: FileText, desc: "3 pending submissions", color: "from-purple-500 to-pink-500" },
    { title: "Attendance", value: "92%", icon: CheckCircle, desc: "+2% from last month", color: "from-emerald-500 to-teal-500" },
    { title: "GPA", value: "3.8", icon: GraduationCap, desc: "Top 15% of your class", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-wider">
          Student Portal
        </div>
        <TextGenerateEffect
          words="Student Dashboard"
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
        />
        <p className="text-lg text-muted-foreground">
          Welcome back, Alex! Here's an overview of your learning progress and upcoming tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary-100/10 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{card.title}</CardTitle>
              <div className={cn("p-2 rounded-xl bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity", card.color)}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-extrabold tracking-tight mb-1">{card.value}</div>
              <p className="text-xs font-medium text-muted-foreground">{card.desc}</p>
            </CardContent>
            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br", card.color)} />
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-8">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-800/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="courses" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">My Courses</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Schedule</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Introduction to Computer Science",
                progress: 75,
                instructor: "Dr. Sarah Johnson",
                nextClass: "Tomorrow, 10:00 AM",
                icon: <BookOpen className="h-6 w-6 text-blue-500" />,
              },
              {
                title: "Calculus II",
                progress: 60,
                instructor: "Prof. Michael Chen",
                nextClass: "Today, 2:00 PM",
                icon: <LineChart className="h-6 w-6 text-purple-500" />,
              },
              {
                title: "Modern World History",
                progress: 45,
                instructor: "Dr. Emily Rodriguez",
                nextClass: "Wednesday, 11:30 AM",
                icon: <Calendar className="h-6 w-6 text-emerald-500" />,
              },
              {
                title: "Organic Chemistry",
                progress: 30,
                instructor: "Prof. David Kim",
                nextClass: "Friday, 9:00 AM",
                icon: <GraduationCap className="h-6 w-6 text-amber-500" />,
              },
            ].map((course, i) => (
              <Card key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50">
                    {course.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                    <CardDescription className="font-semibold text-primary-100">{course.instructor}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest">Progress</span>
                      <span className="text-primary-100">{course.progress}%</span>
                    </div>
                    <div className="relative h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-white/20 dark:border-slate-800">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-100 to-cyan-400 rounded-full shadow-neon-primary transition-all duration-1000 ease-out"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-primary-100/5 dark:bg-primary-100/10 rounded-2xl border border-primary-100/10">
                    <Clock className="h-4 w-4 text-primary-100" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Next class: {course.nextClass}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Weekly Schedule</CardTitle>
              <CardDescription className="font-medium">Your upcoming classes and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="space-y-4">
                    <h3 className="text-sm font-bold text-primary-100 uppercase tracking-[0.2em] px-2">{day}</h3>
                    <div className="grid gap-3">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-12 bg-gradient-to-b from-primary-100 to-cyan-500 rounded-full shadow-neon-primary" />
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-100">Introduction to Computer Science</p>
                              <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                10:00 AM - 11:30 AM
                              </p>
                            </div>
                          </div>
                          <div className="text-xs font-bold bg-primary-100/10 text-primary-100 border border-primary-100/20 px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm">
                            Room 101
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Learning Progress</CardTitle>
              <CardDescription className="font-medium">Your academic performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] flex items-center justify-center bg-primary-100/5 dark:bg-primary-100/10 rounded-2xl border border-dashed border-primary-100/20 m-2">
                <div className="text-center space-y-2">
                  <LineChart className="h-12 w-12 text-primary-100/50 mx-auto" />
                  <span className="text-sm font-bold text-primary-100/70 block uppercase tracking-widest">Progress Visualization</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2 text-primary-100">
            <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="p-3 bg-amber-100/50 dark:bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800 dark:text-gray-100">Research Paper: Topic Analysis</p>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock className="h-3 w-3" />
                          Due in {i + 1} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Upcoming Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="p-3 bg-red-100/50 dark:bg-red-500/10 rounded-xl text-red-600 border border-red-500/20">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-800 dark:text-gray-100">Midterm Examination</p>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar className="h-3 w-3" />
                          May 2{i}, 2026 • 10:00 AM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
