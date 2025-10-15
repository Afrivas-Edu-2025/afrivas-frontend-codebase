import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, CheckCircle, Clock, FileText, GraduationCap, LineChart } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Alex! Here's your learning progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">2 courses in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pending submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">Top 15% of your class</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Introduction to Computer Science",
                progress: 75,
                instructor: "Dr. Sarah Johnson",
                nextClass: "Tomorrow, 10:00 AM",
              },
              {
                title: "Calculus II",
                progress: 60,
                instructor: "Prof. Michael Chen",
                nextClass: "Today, 2:00 PM",
              },
              {
                title: "Modern World History",
                progress: 45,
                instructor: "Dr. Emily Rodriguez",
                nextClass: "Wednesday, 11:30 AM",
              },
              {
                title: "Organic Chemistry",
                progress: 30,
                instructor: "Prof. David Kim",
                nextClass: "Friday, 9:00 AM",
              },
            ].map((course, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Next class: {course.nextClass}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your upcoming classes and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium mb-2">{day}</h3>
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="w-1 h-10 bg-blue-500 rounded-full mr-3"></div>
                            <div>
                              <p className="font-medium">Introduction to Computer Science</p>
                              <p className="text-xs text-gray-500">10:00 AM - 11:30 AM</p>
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
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
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your academic performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <LineChart className="h-16 w-16 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Progress Chart</span>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="rounded-full h-8 w-8 bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Research Paper: Topic Analysis</p>
                        <p className="text-xs text-gray-500">Due in {i + 1} days</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="rounded-full h-8 w-8 bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Midterm Examination</p>
                        <p className="text-xs text-gray-500">May 2{i}, 2023 • 10:00 AM</p>
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
