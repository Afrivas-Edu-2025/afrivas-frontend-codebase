import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, FileText, GraduationCap, Users } from "lucide-react"

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Professor Taylor! Here's an overview of your classes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 classes today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+</div>
            <p className="text-xs text-muted-foreground">3.3 GPA average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Advanced Programming",
                students: 42,
                progress: 65,
                nextClass: "Today, 2:00 PM",
              },
              {
                title: "Data Structures",
                students: 38,
                progress: 50,
                nextClass: "Tomorrow, 10:00 AM",
              },
              {
                title: "Web Development",
                students: 45,
                progress: 75,
                nextClass: "Wednesday, 1:30 PM",
              },
              {
                title: "Database Systems",
                students: 32,
                progress: 40,
                nextClass: "Thursday, 11:00 AM",
              },
            ].map((course, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.students} students enrolled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Course Progress</span>
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
              <CardDescription>Your upcoming classes and office hours</CardDescription>
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
                            <div
                              className={`w-1 h-10 ${i === 1 ? "bg-blue-500" : "bg-green-500"} rounded-full mr-3`}
                            ></div>
                            <div>
                              <p className="font-medium">{i === 1 ? "Advanced Programming" : "Office Hours"}</p>
                              <p className="text-xs text-gray-500">
                                {i === 1 ? "10:00 AM - 11:30 AM" : "2:00 PM - 4:00 PM"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`text-xs ${i === 1 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"} px-2 py-1 rounded`}
                          >
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
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
              <CardDescription>Assignments that need grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full h-10 w-10 bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Final Project Submission</p>
                        <p className="text-sm text-gray-500">Advanced Programming • {42 - i} submissions</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">Grade</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Students with highest grades across your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>S{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Student Name {i}</p>
                        <p className="text-xs text-gray-500">ID: STU-{1000 + i}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{96 - i}%</div>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded">
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
