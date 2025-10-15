// app/(dashboards)/admin/dashboard/page.tsx
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Loader2, AlertCircle } from "lucide-react";
import { AdminDashboardSkeleton, StatsCardSkeleton } from "@/components/skeletons/admin-dashboard-skeleton";
import { AuthDebugPanel } from "@/components/debug/auth-debug-panel";

// Define the static overview data
const overview = {
  totalStudents: 3,
  totalLecturers: 0,
  totalCourses: 0,
  totalDepartments: 0,
  totalFaculties: 0,
  totalEnrollments: 0,
  completionRate: 0,
};

export default function AdminDashboard() {
  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      {/* Development Debug Panel */}
      <AuthDebugPanel />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your educational platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overview.totalStudents)}</div>
            <p className="text-xs text-muted-foreground">Active student accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overview.totalCourses)}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overview.totalFaculties)}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Course completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
                <CardDescription>Student enrollment over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <LineChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Enrollment Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Students by department</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <PieChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Department Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="rounded-full h-8 w-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{i * 10} minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Academic performance by course</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                  <BarChart className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Performance Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <BarChart className="h-16 w-16 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Analytics Dashboard</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>View and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Quarterly Performance Report</p>
                        <p className="text-sm text-gray-500">Generated on May 1{i}, 2023</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">Download</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// SVG Components
function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Award(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}