import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, FileText, GraduationCap, Users, Calendar } from "lucide-react"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function TeacherDashboard() {
  const statCards = [
    { title: "Active Classes", value: "5", icon: BookOpen, desc: "3 classes today", color: "from-blue-500 to-cyan-500" },
    { title: "Total Students", value: "187", icon: Users, desc: "Across all courses", color: "from-purple-500 to-pink-500" },
    { title: "Assignments", value: "24", icon: FileText, desc: "8 pending review", color: "from-amber-500 to-orange-500" },
    { title: "Average Grade", value: "B+", icon: GraduationCap, desc: "3.3 GPA average", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-wider">
          Educator Portal
        </div>
        <TextGenerateEffect
          words="Teacher Dashboard"
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
        />
        <p className="text-lg text-muted-foreground">
          Welcome back, Professor Taylor! Here's an overview of your classes and student performance.
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

      <Tabs defaultValue="classes" className="space-y-8">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-800/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="classes" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">My Classes</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Schedule</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="classes" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Advanced Programming",
                students: 42,
                progress: 65,
                nextClass: "Today, 2:00 PM",
                icon: <BookOpen className="h-6 w-6 text-blue-500" />,
              },
              {
                title: "Data Structures",
                students: 38,
                progress: 50,
                nextClass: "Tomorrow, 10:00 AM",
                icon: <GraduationCap className="h-6 w-6 text-purple-500" />,
              },
              {
                title: "Web Development",
                students: 45,
                progress: 75,
                nextClass: "Wednesday, 1:30 PM",
                icon: <FileText className="h-6 w-6 text-emerald-500" />,
              },
              {
                title: "Database Systems",
                students: 32,
                progress: 40,
                nextClass: "Thursday, 11:00 AM",
                icon: <Users className="h-6 w-6 text-amber-500" />,
              },
            ].map((course, i) => (
              <Card key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50">
                    {course.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                    <CardDescription className="font-semibold text-primary-100">{course.students} students enrolled</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-muted-foreground uppercase tracking-widest">Course Progress</span>
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
              <CardDescription className="font-medium">Your upcoming classes and office hours</CardDescription>
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
                            <div className={cn(
                              "w-1.5 h-12 rounded-full shadow-lg",
                              i === 1 ? "bg-gradient-to-b from-blue-500 to-cyan-500 shadow-blue-500/20" : "bg-gradient-to-b from-emerald-500 to-teal-500 shadow-emerald-500/20"
                            )} />
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-100">{i === 1 ? "Advanced Programming" : "Office Hours"}</p>
                              <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 flex flex-row">
                                <Clock className="h-3 w-3" />
                                {i === 1 ? "10:00 AM - 11:30 AM" : "2:00 PM - 4:00 PM"}
                              </p>
                            </div>
                          </div>
                          <div className={cn(
                            "text-xs font-bold border px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm",
                            i === 1 ? "bg-blue-100/10 text-blue-500 border-blue-500/20" : "bg-emerald-100/10 text-emerald-500 border-emerald-500/20"
                          )}>
                            {i === 1 ? "Room 201" : "Office 305"}
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
        <TabsContent value="assignments" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Pending Assignments</CardTitle>
              <CardDescription className="font-medium">Assignments that need grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100/50 dark:bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">Final Project Submission</p>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{42 - i} submissions</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 text-sm font-bold bg-primary-100 text-white rounded-xl shadow-neon-primary hover:scale-105 transition-all">Grade</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Top Performing Students</CardTitle>
              <CardDescription className="font-medium">Students with highest grades across your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-primary-100/5 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-primary-100 opacity-0 group-hover:opacity-20 blur transition-all" />
                        <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm relative z-10">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                          <AvatarFallback className="font-bold text-primary-100">S{i}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">Student Name {i}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">ID: STU-{1000 + i}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-extrabold text-primary-100">{96 - i}%</div>
                      <div className="text-xs font-bold px-3 py-1.5 bg-emerald-100/20 text-emerald-500 border border-emerald-500/20 rounded-xl uppercase tracking-wider">
                        A{i === 1 ? "+" : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
