// app/(dashboards)/admin/dashboard/page.tsx
'use client';

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  PieChart,
  Loader2,
  AlertCircle,
  Users,
  BookOpen,
  User,
  Award,
  FileText,
  Activity,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Target,
  Layers,
  ShieldCheck,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import { AdminDashboardSkeleton } from "@/components/skeletons/admin-dashboard-skeleton";
import { AuthDebugPanel } from "@/components/debug/auth-debug-panel";
import { useGetDashboardStatsQuery } from "@/services/adminApi";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const POLL_INTERVAL = 30_000;

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: POLL_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Track last successful update time
  useEffect(() => {
    if (dashboardData && !isFetching) {
      setLastUpdated(new Date());
    }
  }, [dashboardData, isFetching]);

  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const formatLastUpdated = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/10 border border-red-500/20 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mx-auto mb-6">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-rose-500 tracking-tight mb-2">Protocol Failure</h2>
          <p className="text-muted-foreground font-medium text-sm mb-8 leading-relaxed">System diagnostics failed to synchronize with the institutional core. Please re-initialize authentication.</p>
          <Button variant="outline" className="rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold text-sm" onClick={() => window.location.reload()}>
            Re-Initialize Sync
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Student Population", value: formatNumber(overview.totalStudents), icon: Users, desc: "Active Scholastic Nodes", color: "text-blue-500", glow: "shadow-blue-500/10", trend: "+42 Ingress" },
    { title: "Curriculum Units", value: formatNumber(overview.totalCourses), icon: BookOpen, desc: "Verified Academic Tracks", color: "text-purple-500", glow: "shadow-purple-500/10", trend: "+8 Structural" },
    { title: "Faculty Leads", value: formatNumber(overview.totalFaculties), icon: LayoutGrid, desc: "Primary Academic Sectors", color: "text-amber-500", glow: "shadow-amber-500/10", trend: "0 Deviation" },
    { title: "Completion Index", value: `${overview.completionRate}%`, icon: Award, desc: "Mastery Fulfillment Rate", color: "text-emerald-500", glow: "shadow-emerald-500/10", trend: "+2.4% Momentum" },
  ];

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      {/* Development Debug Panel */}
      <AuthDebugPanel />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-wide">
            <Activity className="w-3.5 h-3.5 mr-2" />
            Institutional Overview
          </div>
          <TextGenerateEffect
            words="Command Control"
            className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium max-w-xl text-lg">
            Atmospheric telemetry of institutional performance metrics, pedagogical trajectory, and structural health diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide">Live</span>
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground font-medium">
                · {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isFetching}
            className="rounded-2xl border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold h-12 px-5"
          >
            <RefreshCw className={cn("h-4 w-4", (isRefreshing || isFetching) && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <SummaryCard
            key={idx}
            title={card.title}
            value={card.value}
            description={card.desc}
            icon={<card.icon className="h-5 w-5" />}
            color={card.color}
            glow={card.glow}
            trend={card.trend}
          />
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-10">
        <TabsList className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-1.5 rounded-3xl h-16 flex w-fit">
          <TabsTrigger value="overview" className="rounded-2xl px-10 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Registry</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-2xl px-10 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-2xl px-10 py-3 data-[state=active]:bg-primary-100 data-[state=active]:text-white data-[state=active]:shadow-neon-primary transition-all duration-500 font-bold text-sm">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">Enrollment Heuristics</CardTitle>
                    <CardDescription className="text-xs font-bold mt-1">Temporal analysis of structural ingress (12 months)</CardDescription>
                  </div>
                  <Badge variant="glass" className={cn("bg-primary-100/10 text-primary-100 border-primary-100/20 px-3 font-bold text-[10px] flex items-center gap-1.5", isFetching && "opacity-70")}>
                    {isFetching ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />}
                    {isFetching ? "Syncing" : "Live Feed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[380px] flex items-center justify-center bg-primary-100/5 dark:bg-primary-100/10 rounded-3xl border border-dashed border-primary-100/20 relative group">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-100 opacity-20" />
                  <div className="text-center space-y-4">
                    <LineChart className="h-16 w-16 text-primary-100/30 mx-auto group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-sm font-bold text-primary-100/70 block tracking-wide">Temporal Visualization Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">Sector Distribution</CardTitle>
                    <CardDescription className="text-xs font-bold mt-1">Weighted metric by academic department</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[380px] flex items-center justify-center bg-indigo-500/5 dark:bg-indigo-500/10 rounded-3xl border border-dashed border-indigo-500/20 relative group">
                  <div className="text-center space-y-4">
                    <PieChart className="h-16 w-16 text-indigo-500/30 mx-auto group-hover:rotate-12 transition-transform duration-700" />
                    <span className="text-sm font-bold text-indigo-500/70 block tracking-wide">Structural Matrix Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-primary-100">Temporal Logs</CardTitle>
                  <CardDescription className="text-xs font-bold mt-1 italic">Real-time institutional activity</CardDescription>
                </div>
                {isFetching
                  ? <Loader2 size={18} className="text-primary-100 opacity-60 animate-spin" />
                  : <Activity size={20} className="text-primary-100 opacity-20 animate-pulse" />
                }
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity: any, idx: number) => (
                      <div key={activity.id} className="flex items-start gap-5 group cursor-default relative">
                        {idx !== 4 && <div className="absolute left-5 top-10 w-px h-8 bg-white/10 dark:bg-slate-800" />}
                        <div className="relative">
                          <div className="absolute -inset-1 rounded-full bg-primary-100 opacity-0 group-hover:opacity-20 blur transition-opacity" />
                          <div className="relative rounded-2xl h-10 w-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <User className="h-5 w-5 text-primary-100" />
                          </div>
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight">{activity.action}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-primary-100">{activity.name}</span>
                            <span className="text-[10px] font-medium text-muted-foreground opacity-60">— {new Date(activity.time).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-primary-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 opacity-20 grayscale">
                      <Layers size={40} className="mx-auto mb-4" />
                      <p className="text-xs font-bold tracking-widest">Zero Activity Detected</p>
                    </div>
                  )}
                </div>
                <Button variant="ghost" className="w-full mt-6 rounded-xl font-bold text-xs text-primary-100 hover:bg-primary-100/10">
                  Audit Detailed Activity Logs
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Efficiency Metrics</CardTitle>
                    <CardDescription className="text-xs font-bold mt-1">Scholastic output fulfillment by curriculum node</CardDescription>
                  </div>
                  <Target size={20} className="text-emerald-500 opacity-20" />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[380px] flex items-center justify-center bg-emerald-500/5 dark:bg-emerald-500/10 rounded-3xl border border-dashed border-emerald-500/20 relative group">
                  <div className="text-center space-y-4">
                    <BarChart className="h-16 w-16 text-emerald-500/30 mx-auto group-hover:scale-y-125 transition-transform duration-700" />
                    <span className="text-sm font-bold text-emerald-500/70 block tracking-wide">Valuation Heuristics Visualization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-10">
          <div className="grid gap-8 md:grid-cols-2 px-1">
            {[
              { title: "Institutional Quarter Node", date: "May 15, 2026", type: "Summative", icon: <FileText className="h-6 w-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Faculty Resource Allocation", date: "May 12, 2026", type: "Structural", icon: <Layers className="h-6 w-6" />, color: "text-purple-500", bg: "bg-purple-500/10" },
              { title: "Scholastic Momentum Drift", date: "May 08, 2026", type: "Predictive", icon: <TrendingUp className="h-6 w-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { title: "Security Matrix Audit", date: "May 02, 2026", type: "Verified", icon: <ShieldCheck className="h-6 w-6" />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] group hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/5 relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                  <div className={cn("p-4 rounded-2xl shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500", report.bg, report.color)}>
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight group-hover:text-primary-100 transition-colors leading-tight">{report.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-bold text-muted-foreground">{report.type} Protocol</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] font-medium text-muted-foreground opacity-60">Synchronized: {report.date}</span>
                    </div>
                  </div>
                </div>
                <Button variant="premium" className="px-6 h-11 rounded-2xl text-[11px] font-bold shadow-neon-primary hover:scale-105 transition-all relative z-10">
                  Retrieve Asset
                </Button>
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                  <Zap size={100} />
                </div>
              </div>
            ))}
          </div>
          <Card className="bg-primary-100/5 border border-dashed border-primary-100/20 rounded-[2.5rem] p-12 text-center group cursor-pointer hover:bg-primary-100/10 transition-colors">
            <LayoutGrid size={40} className="mx-auto text-primary-100 opacity-30 mb-6 group-hover:rotate-45 transition-transform duration-700" />
            <h3 className="text-xl font-bold tracking-tight text-primary-100">Global Archive Sync</h3>
            <p className="max-w-md mx-auto text-sm font-medium opacity-60 mt-2 leading-relaxed">Initialize a comprehensive diagnostic dump of all institutional assets into an encrypted neural archive.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryCard({ title, value, description, icon, color, glow, trend }: any) {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-white/10 to-transparent">
        <CardTitle className="text-xs font-bold text-muted-foreground tracking-tight">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 shadow-sm border border-white/20 transition-transform group-hover:scale-110 group-hover:rotate-6", color, glow)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-4xl font-bold tracking-tighter mb-1 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic">{value}</div>
        <p className="text-[11px] font-bold text-muted-foreground tracking-tight">{description}</p>
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-primary-100 italic">{trend}</span>
          <Activity className="w-3 h-3 text-primary-100/20" />
        </div>
      </CardContent>
      {/* Ghost background decoration */}
      <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
        {icon}
      </div>
    </Card>
  )
}
