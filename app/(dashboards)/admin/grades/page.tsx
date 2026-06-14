'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Award,
  Zap,
  TrendingUp,
  Activity,
  Sparkles,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  Target,
  Layers,
  ShieldCheck,
  User,
  BookOpen,
  PieChart,
  BarChart3
} from 'lucide-react';
import {
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation
} from '@/services/adminApi';
import { Grade } from '@/types/admin';
import CreateGradeForm from '@/components/forms/CreateGradeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"
import { toast } from 'sonner';

export default function GradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeToDelete, setGradeToDelete] = useState<{ id: string; studentName: string } | null>(null);

  const { data: gradesResponse, isLoading, error, refetch } = useGetGradesQuery();
  const [deleteGrade] = useDeleteGradeMutation();

  const grades = gradesResponse?.data || [];
  const filteredGrades = useMemo(() => {
    return grades?.filter(grade =>
      grade.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (((grade as any).module?.name || grade.course?.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
      grade.gradeType.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [grades, searchTerm]);

  const handleDelete = async () => {
    if (!gradeToDelete) return;
    try {
      await deleteGrade(gradeToDelete.id).unwrap();
      toast.success('Valuation record purged from registry');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Purging protocol failed');
    } finally {
      setGradeToDelete(null);
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-neon-emerald';
    if (score >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-neon-amber';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Synchronizing Academic Valuation Core...</p>
    </div>
  );

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-tight mb-1">
            <Award className="w-3.5 h-3.5 mr-2" />
            Scholastic Assessment
          </div>
          <TextGenerateEffect
            words="Grades Management"
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic tracking-tight"
          />
          <p className="text-muted-foreground font-medium max-w-xl">Supervision and validation of academic fulfillment metrics, performance distribution, and mastery heuristics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl h-12 px-6 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold text-sm hover:bg-primary-100/5 transition-all"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh Core
          </Button>
          <CreateGradeForm />
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Valuations"
          value={grades.length.toString()}
          description="Integrated Records"
          icon={<Layers className="w-4 h-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
          trend="+42 Ingress"
        />
        <SummaryCard
          title="Global Average"
          value={`${(grades.reduce((acc, g) => acc + g.score, 0) / (grades.length || 1)).toFixed(1)}%`}
          description="Mastery Threshold"
          icon={<Target className="w-4 h-4 text-purple-500" />}
          color="text-purple-500"
          glow="shadow-purple-500/10"
          trend="+2.4% Momentum"
        />
        <SummaryCard
          title="High Yield Nodes"
          value={grades.filter(g => g.score >= 80).length.toString()}
          description="Excellence Density"
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
          trend="Top Tier"
        />
        <SummaryCard
          title="Fulfillment"
          value="94%"
          description="Verification Rate"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
          trend="Secure"
        />
      </div>

      {/* Discovery Layer */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Query valuation matrix (student, module, or type)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-sm font-bold"
                />
              </div>
            </div>
            <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-bold text-sm h-12 px-8">
              Initialize Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Matrix */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-primary-100 italic">Valuation Registry</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1 italic">Real-time synchronization of recognized academic fulfillment metrics</CardDescription>
          </div>
          <Badge variant="glass" className="font-bold text-[10px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-4 py-1.5">Verified</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Student node</th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Curriculum unit</th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Metric type</th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Quantified score</th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Temporal cycle</th>
                  <th className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Fulfillment</th>
                  <th className="px-8 py-6 text-right text-xs font-bold text-muted-foreground tracking-tight">Protocol</th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-lg group-hover:scale-110 transition-transform overflow-hidden relative">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight italic">{grade.student?.fullName || 'Unknown Student'}</span>
                          <span className="text-[10px] font-medium text-muted-foreground opacity-60 lowercase">{grade.student?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground italic">{(grade as any).module?.name || grade.course?.name || 'Unknown Module'}</span>
                        <span className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-tighter">{(grade as any).module?.code || grade.course?.code || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="glass" className="bg-primary-100/10 text-primary-100 border-primary-100/20 text-[10px] font-bold px-3 italic">
                        {grade.gradeType}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="glass"
                        className={cn(
                          "px-3 py-1 font-bold text-xs tracking-tighter italic",
                          getGradeColor(grade.score)
                        )}
                      >
                        {grade.score}%
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-muted-foreground opacity-60 italic">
                        {grade.semester} {grade.academicYear}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="glass"
                        className={cn(
                          "px-3 py-1 font-bold text-[10px] tracking-tight",
                          grade.approved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        )}
                      >
                        {grade.approved ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-primary-100 hover:bg-primary-100/10 rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        onClick={() => setGradeToDelete({ id: grade.id, studentName: grade.student?.fullName || 'Node' })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-white/5 text-muted-foreground opacity-20">
                <BarChart3 size={64} />
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-widest">Registry Scan Result: Zero Valuations Identified</p>
              <Button variant="outline" className="rounded-xl border-white/20" onClick={() => setSearchTerm('')}>Reset Exploration Parameters</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!gradeToDelete} onOpenChange={() => setGradeToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-white/20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl p-10">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mb-6">
            <Activity size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Valuation Purge Protocol</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-rose-500 text-sm leading-relaxed mt-2">
              Executing structural termination of valuation data for <strong>{gradeToDelete?.studentName}</strong>. This purge will permanently deactivate the fulfillment record and destabilize scholastic heuristics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl border-white/20 font-bold text-sm h-11 px-6">Abort Protocol</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm h-11 px-8 border-none shadow-lg shadow-rose-500/20 text-white">Authorize Purge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
