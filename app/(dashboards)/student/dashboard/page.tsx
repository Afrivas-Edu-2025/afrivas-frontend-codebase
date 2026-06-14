'use client';

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Calendar, CheckCircle, Clock, FileText, GraduationCap,
  LineChart, Award, Sparkles, ChevronRight, TrendingUp, ArrowRight,
  Bell, Activity
} from 'lucide-react';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-context';
import { useGetMyDashboardStatsQuery, useGetMyCoursesQuery, useGetMyAssignmentsQuery, useGetMyNoticesQuery } from '@/services/studentApi';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useGetMyDashboardStatsQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetMyCoursesQuery();
  const { data: assignmentsData } = useGetMyAssignmentsQuery();
  const { data: noticesData } = useGetMyNoticesQuery();

  const stats = statsData?.data;
  const courses = coursesData?.data || [];
  const assignments = assignmentsData?.data || [];
  const notices = noticesData?.data || [];

  const upcomingAssignments = assignments.filter((a) => {
    const diff = (new Date(a.dueDate).getTime() - Date.now()) / 86400000;
    return diff >= 0 && diff <= 7;
  }).slice(0, 3);

  const statCards = [
    {
      title: 'Courses Enrolled',
      value: statsLoading ? '—' : String(stats?.enrolledCourses ?? courses.length),
      icon: BookOpen,
      desc: 'Active Curriculum',
      color: 'text-indigo-500',
      glow: 'shadow-indigo-500/10',
      trend: `${stats?.completedCourses ?? 0} completed`,
    },
    {
      title: 'Pending Assignments',
      value: statsLoading ? '—' : String(assignments.filter((a) => new Date(a.dueDate) >= new Date()).length),
      icon: FileText,
      desc: 'Upcoming Deadlines',
      color: 'text-primary-100',
      glow: 'shadow-primary-100/10',
      trend: `${assignments.filter((a) => { const d = (new Date(a.dueDate).getTime() - Date.now()) / 86400000; return d >= 0 && d <= 3; }).length} due soon`,
    },
    {
      title: 'Attendance Rate',
      value: statsLoading ? '—' : `${stats?.attendanceRate ?? 0}%`,
      icon: CheckCircle,
      desc: 'Scholastic Presence',
      color: 'text-emerald-500',
      glow: 'shadow-emerald-500/10',
      trend: stats?.attendanceRate && stats.attendanceRate >= 75 ? 'Good Standing' : 'Needs Improvement',
    },
    {
      title: 'Cumulative GPA',
      value: statsLoading ? '—' : String(stats?.averageGPA ?? 0),
      icon: Award,
      desc: 'Grade Point Average',
      color: 'text-amber-500',
      glow: 'shadow-amber-500/10',
      trend: stats?.averageGPA && stats.averageGPA >= 3.5 ? 'Excellent' : stats?.averageGPA && stats.averageGPA >= 2.5 ? 'Good' : 'Needs Improvement',
    },
  ];

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 border border-primary-100/20 text-[11px] font-bold text-primary-100 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 mr-2" /> Scholastic Command
          </div>
          <TextGenerateEffect
            words="Strategic Overview"
            className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-2xl text-lg">
            Welcome back, <span className="text-primary-100 font-bold">{user?.username || 'Student'}</span>.
            {stats?.attendanceRate && stats.attendanceRate >= 80
              ? ' Your academic trajectory is at optimal capacity.'
              : ' Keep up with your studies to stay on track.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
            Full Archive
          </Button>
          <Button variant="premium" className="rounded-xl px-6 h-12 shadow-neon-primary group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Insight Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <SummaryCard key={idx} {...card} />
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="courses" className="space-y-10">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-1.5 rounded-3xl h-16 flex w-fit">
            <TabsTrigger value="courses" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Curriculum</TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Deadlines</TabsTrigger>
            <TabsTrigger value="notices" className="rounded-2xl px-8 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Notices</TabsTrigger>
          </TabsList>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
            <Clock className="w-3.5 h-3.5 text-primary-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {courses.filter((c) => c.status === 'ACTIVE').length} active courses
            </span>
          </div>
        </div>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {coursesLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <BookOpen className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No courses enrolled yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {courses.slice(0, 4).map((enrollment) => {
                const progress = Math.min(enrollment.finalPercentage || 0, 100);
                const instructor = enrollment.module.lecturer?.user;
                const nextClass = enrollment.module.class?.[0];
                return (
                  <Card key={enrollment.id}
                    className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 relative">
                    <CardHeader className="flex flex-row items-center gap-5 relative z-10">
                      <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-500">
                        <BookOpen className="h-6 w-6 text-primary-100" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black uppercase tracking-tight leading-tight">
                          {enrollment.module.moduleName}
                        </CardTitle>
                        <CardDescription className="font-bold text-primary-100 text-[10px] uppercase tracking-[0.15em] mt-1">
                          {instructor ? `${instructor.firstName} ${instructor.lastName}` : 'TBA'}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black">
                          <span className="text-muted-foreground uppercase tracking-widest">Progress</span>
                          <span className="text-primary-100">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-100/5 border border-primary-100/10">
                          <Clock className="h-3 w-3 text-primary-100" />
                          <span className="text-[9px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                            {nextClass ? `${nextClass.day}` : 'No class scheduled'}
                          </span>
                        </div>
                        <Badge variant="outline" className={cn(
                          'text-[10px] font-bold',
                          enrollment.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20' : 'text-muted-foreground'
                        )}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {courses.length > 4 && (
            <div className="text-center">
              <Link href="/student/dashboard/academics">
                <Button variant="outline" className="rounded-xl font-bold text-xs text-primary-100 hover:bg-primary-100/10">
                  View All {courses.length} Courses <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="upcoming" className="animate-in slide-in-from-bottom-4 duration-700">
          <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/10">
              <CardTitle className="text-xl font-black uppercase tracking-[0.2em] text-primary-100">Upcoming Deadlines</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">Assignments due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-bold text-sm">No upcoming deadlines!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {upcomingAssignments.map((a) => {
                    const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
                    return (
                      <div key={a.id} className="flex items-center justify-between p-6 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'p-2.5 rounded-xl border',
                            daysLeft <= 1 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          )}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-sm group-hover:text-primary-100 transition-colors">{a.title}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                              {a.module.moduleCode} — {a.module.moduleName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn('text-sm font-black', daysLeft <= 1 ? 'text-rose-500' : 'text-amber-500')}>
                            {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{new Date(a.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="p-4 border-t border-white/5 text-center">
                <Link href="/student/dashboard/academics/assignments">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary-100 hover:bg-primary-100/10 rounded-xl">
                    View All Assignments <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="animate-in slide-in-from-bottom-4 duration-700">
          {notices.length === 0 ? (
            <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
              <CardContent className="py-16 text-center opacity-40">
                <Bell className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold text-sm">No notices at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notices.slice(0, 5).map((notice) => (
                <Card key={notice.id}
                  className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-primary-100/10 border border-primary-100/20 text-primary-100 shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm group-hover:text-primary-100 transition-colors leading-tight">
                            {notice.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{notice.body}</p>
                        {notice.module && (
                          <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px] mt-2">
                            {notice.module.moduleCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, desc, color, glow, trend }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <div className={cn('absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700', color)}>
        <Icon size={120} />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn('p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform active:scale-95', glow)}>
          <Icon className={cn('h-4 w-4', color)} />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-black tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{value}</div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 opacity-80">{desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-primary-100 uppercase tracking-widest">{trend}</span>
          <TrendingUp className="w-3 h-3 text-emerald-500 opacity-60" />
        </div>
      </CardContent>
    </Card>
  );
}
