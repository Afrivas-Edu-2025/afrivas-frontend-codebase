'use client';

import { useState, useMemo } from 'react';
import {
  FileText, Clock, Calendar, CheckCircle, AlertTriangle, Search, BookOpen, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { useGetMyAssignmentsQuery } from '@/services/studentApi';

const getDueStatus = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: 'Overdue', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', urgent: true };
  if (diff <= 3) return { label: 'Due Soon', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', urgent: true };
  return { label: 'Upcoming', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', urgent: false };
};

const formatDue = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
};

export default function AssignmentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const { data, isLoading } = useGetMyAssignmentsQuery();
  const assignments = data?.data || [];

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const status = getDueStatus(a.dueDate);
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.module.moduleName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' ||
        (filter === 'OVERDUE' && status.label === 'Overdue') ||
        (filter === 'DUE_SOON' && status.label === 'Due Soon') ||
        (filter === 'UPCOMING' && status.label === 'Upcoming');
      return matchesSearch && matchesFilter;
    });
  }, [assignments, search, filter]);

  const counts = useMemo(() => ({
    total: assignments.length,
    overdue: assignments.filter((a) => getDueStatus(a.dueDate).label === 'Overdue').length,
    dueSoon: assignments.filter((a) => getDueStatus(a.dueDate).label === 'Due Soon').length,
    upcoming: assignments.filter((a) => getDueStatus(a.dueDate).label === 'Upcoming').length,
  }), [assignments]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Assignments
            </span>
          </div>
          <TextGenerateEffect words="My Assignments"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent" />
          <p className="text-muted-foreground font-medium mt-1">Track assignments across all your enrolled modules</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', filter: 'ALL' },
          { label: 'Upcoming', value: counts.upcoming, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', filter: 'UPCOMING' },
          { label: 'Due Soon', value: counts.dueSoon, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', filter: 'DUE_SOON' },
          { label: 'Overdue', value: counts.overdue, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', filter: 'OVERDUE' },
        ].map((s) => (
          <Card key={s.label}
            className={cn('border backdrop-blur-xl rounded-2xl cursor-pointer transition-all hover:shadow-lg', s.bg, filter === s.filter ? 'ring-2 ring-offset-2 ring-primary-100/30' : '')}
            onClick={() => setFilter(s.filter)}>
            <CardContent className="p-4 text-center">
              <div className={cn('text-3xl font-black tracking-tight', s.color)}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
      </div>

      {/* Assignments List */}
      {filtered.length === 0 ? (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
          <CardContent className="py-16 text-center opacity-40">
            <FileText className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-sm">No assignments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((assignment) => {
            const status = getDueStatus(assignment.dueDate);
            const relativeTime = formatDue(assignment.dueDate);
            return (
              <Card key={assignment.id}
                className={cn(
                  'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl group hover:shadow-lg transition-all duration-300',
                  status.urgent && 'border-l-4 border-l-current' + (status.label === 'Overdue' ? ' border-l-rose-500' : ' border-l-amber-500')
                )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={cn('shrink-0 p-2.5 rounded-xl border mt-0.5', status.color)}>
                        {status.label === 'Overdue'
                          ? <AlertTriangle className="w-4 h-4" />
                          : status.label === 'Due Soon'
                            ? <Clock className="w-4 h-4" />
                            : <FileText className="w-4 h-4" />
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-base leading-tight group-hover:text-primary-100 transition-colors">
                          {assignment.title}
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{assignment.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-[10px]">
                            {assignment.module.moduleCode} — {assignment.module.moduleName}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Max: {assignment.maxScore} pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-2">
                      <span className={cn('inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase border', status.color)}>
                        {status.label}
                      </span>
                      <div className="text-xs text-muted-foreground">{relativeTime}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {assignment.filePath && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1.5 h-7">
                        <Download className="w-3 h-3" /> Download Brief
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
