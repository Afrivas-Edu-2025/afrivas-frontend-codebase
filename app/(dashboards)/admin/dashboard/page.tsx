// app/(dashboards)/admin/dashboard/page.tsx
'use client';

import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Loader2, AlertCircle, Users, BookOpen, User, Award, FileText } from "lucide-react";
import { AdminDashboardSkeleton, StatsCardSkeleton } from "@/components/skeletons/admin-dashboard-skeleton";
import { AuthDebugPanel } from "@/components/debug/auth-debug-panel";
import { useGetDashboardStatsQuery } from "@/services/adminApi";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery();

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Extract data from API response
  const overview = dashboardData?.data?.overview || {
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalFaculties: 0,
    totalEnrollments: 0,
    completionRate: 0,
  };

  const recentActivity = dashboardData?.data?.recentActivity || [];

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Students", value: formatNumber(overview.totalStudents), icon: Users, desc: "Active student accounts", color: "from-blue-500 to-cyan-500" },
    { title: "Active Courses", value: formatNumber(overview.totalCourses), icon: BookOpen, desc: "Available courses", color: "from-purple-500 to-pink-500" },
    { title: "Faculty Members", value: formatNumber(overview.totalFaculties), icon: User, desc: "Active faculty members", color: "from-amber-500 to-orange-500" },
    { title: "Completion Rate", value: `${overview.completionRate}%`, icon: Award, desc: "Course completion rate", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-10">
      {/* Development Debug Panel */}
      <AuthDebugPanel />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-wider">
            Admin Overview
          </div>
          <TextGenerateEffect
            words="Admin Dashboard"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-lg text-muted-foreground max-w-lg">
            Welcome back! Here's an overview of your educational platform's performance today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-xl text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary-100/50 transition-all outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
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
            {/* Subtle background glow */}
            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br", card.color)} />
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-800/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="overview" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-300 font-bold">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Enrollment Trends</CardTitle>
                <CardDescription className="font-medium">Student enrollment over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] flex items-center justify-center bg-primary-100/5 dark:bg-primary-100/10 rounded-2xl border border-dashed border-primary-100/20 m-2">
                  <div className="text-center space-y-2">
                    <LineChart className="h-12 w-12 text-primary-100/50 mx-auto" />
                    <span className="text-sm font-bold text-primary-100/70 block uppercase tracking-widest">Enrollment Chart Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Department Distribution</CardTitle>
                <CardDescription className="font-medium">Students by department</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] flex items-center justify-center bg-secondary-100/5 dark:bg-secondary-100/10 rounded-2xl border border-dashed border-secondary-100/20 m-2">
                  <div className="text-center space-y-2">
                    <PieChart className="h-12 w-12 text-secondary-100/50 mx-auto" />
                    <span className="text-sm font-bold text-secondary-100/70 block uppercase tracking-widest">Department Chart Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Recent Activities</CardTitle>
                <CardDescription className="font-medium">Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-4 group cursor-default">
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full bg-primary-100 opacity-20 blur group-hover:opacity-40 transition-opacity" />
                          <div className="relative rounded-full h-10 w-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-primary-100" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{activity.action}</p>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="text-primary-100">{activity.name}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            {new Date(activity.time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No recent activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Performance Metrics</CardTitle>
                <CardDescription className="font-medium">Academic performance by course</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] flex items-center justify-center bg-lemon-100/5 dark:bg-lemon-100/10 rounded-2xl border border-dashed border-lemon-100/20 m-2">
                  <div className="text-center space-y-2">
                    <BarChart className="h-12 w-12 text-lemon-400 mx-auto opacity-50" />
                    <span className="text-sm font-bold text-lemon-400 block uppercase tracking-widest">Performance Chart Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Advanced Analytics</CardTitle>
              <CardDescription className="font-medium">Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center bg-gray-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 m-2">
                <div className="text-center space-y-4">
                  <BarChart className="h-16 w-16 text-primary-100/50 mx-auto animate-pulse" />
                  <span className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Analytics Dashboard Incoming</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Generated Reports</CardTitle>
              <CardDescription className="font-medium">View and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-[1.5rem] group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-blue-100/50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">Quarterly Performance Report</p>
                        <p className="text-sm font-semibold text-gray-500">Generated on May 1{i}, 2026</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 text-sm font-bold bg-primary-100 text-white rounded-xl shadow-neon-primary hover:scale-105 transition-all">Download</button>
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
