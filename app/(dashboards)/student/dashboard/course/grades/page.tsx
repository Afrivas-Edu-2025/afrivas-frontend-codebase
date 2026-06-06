'use client';

import { useMemo, useState } from 'react';
import { Award, BookOpen, TrendingUp, Search, ChevronDown, ChevronUp, Sparkles, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { useGetMyGradesQuery } from '@/services/studentApi';

const gradeColor = (pct: number) => {
  if (pct >= 80) return 'text-emerald-500';
  if (pct >= 60) return 'text-amber-500';
  if (pct >= 50) return 'text-orange-500';
  return 'text-rose-500';
};
const gradeBg = (pct: number) => {
  if (pct >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
  if (pct >= 60) return 'bg-amber-500/10 border-amber-500/20';
  if (pct >= 50) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-rose-500/10 border-rose-500/20';
};
const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'GRADED') return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
  if (status === 'SUBMITTED') return <Clock className="w-3.5 h-3.5 text-amber-500" />;
  return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
};

export default function GradesPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data, isLoading } = useGetMyGradesQuery();
  const enrollments = data?.data || [];

  const filtered = useMemo(() =>
    enrollments.filter((e) =>
      e.module.moduleName.toLowerCase().includes(search.toLowerCase()) ||
      e.module.moduleCode.toLowerCase().includes(search.toLowerCase())
    ), [enrollments, search]);

  const validGPs = enrollments.filter((e) => e.gradePoint > 0).map((e) => e.gradePoint);
  const gpa = validGPs.length > 0 ? (validGPs.reduce((a, b) => a + b, 0) / validGPs.length).toFixed(2) : '0.00';
  const avgPct = enrollments.length > 0 ? Math.round(enrollments.reduce((a, e) => a + e.finalPercentage, 0) / enrollments.length) : 0;

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3 h-3" /> Academic Performance
            </span>
          </div>
          <TextGenerateEffect words="My Grades"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent" />
          <p className="text-muted-foreground font-medium mt-1">Track your grades and academic performance</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary group h-11">
          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Performance Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Cumulative GPA', value: gpa, icon: Award, color: 'text-amber-500', desc: 'Grade Point Average' },
          { label: 'Average Score', value: `${avgPct}%`, icon: TrendingUp, color: 'text-emerald-500', desc: 'Across all modules' },
          { label: 'Courses Enrolled', value: enrollments.length, icon: BookOpen, color: 'text-blue-500', desc: 'Total enrollments' },
        ].map((s) => (
          <Card key={s.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn('p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className={cn('text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</div>
                <div className="text-[10px] text-muted-foreground opacity-70">{s.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search modules..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50" />
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
          <CardContent className="py-16 text-center opacity-40">
            <Award className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-sm">No grades available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((enrollment) => {
            const isOpen = expanded === enrollment.id;
            const pct = enrollment.finalPercentage;
            return (
              <Card key={enrollment.id} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="p-5 cursor-pointer" onClick={() => setExpanded(isOpen ? null : enrollment.id)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn('shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border', gradeBg(pct), gradeColor(pct))}>
                        {enrollment.letterGrade || '—'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-base leading-tight truncate group-hover:text-primary-100 transition-colors">
                          {enrollment.module.moduleName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px]">
                            {enrollment.module.moduleCode}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {enrollment.semester.semesterName} {enrollment.semester.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn('text-2xl font-black tracking-tight', gradeColor(pct))}>
                        {pct > 0 ? `${pct.toFixed(1)}%` : '—'}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">
                        {enrollment.gradePoint > 0 ? `${enrollment.gradePoint.toFixed(1)} GP` : 'Pending'}
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-primary-100 shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </div>
                  {pct > 0 && <Progress value={pct} className="h-1.5 rounded-full mt-3" />}
                </div>

                {isOpen && enrollment.grade.length > 0 && (
                  <div className="border-t border-white/10 bg-white/5 dark:bg-slate-900/20 p-4 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Assessment Breakdown</div>
                    {enrollment.grade.map((g) => (
                      <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-white/10">
                        <div className="flex items-center gap-2.5">
                          <StatusIcon status={g.status} />
                          <div>
                            <div className="text-sm font-semibold">{g.assessment.title}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{g.assessment.type} • Weight: {g.assessment.weight}%</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn('font-black text-sm', gradeColor(g.percentage))}>
                            {g.status === 'GRADED' ? `${g.score}/${g.assessment.maxScore}` : g.status}
                          </div>
                          {g.status === 'GRADED' && <div className="text-[10px] text-muted-foreground">{g.percentage.toFixed(1)}%</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
