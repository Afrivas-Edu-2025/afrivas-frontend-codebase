'use client';

import { useState, useMemo } from 'react';
import {
  CheckCircle, XCircle, AlertCircle, Clock, Calendar, TrendingUp,
  Search, BookOpen, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useGetMyAttendanceQuery } from '@/services/studentApi';

const STATUS_STYLE: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  PRESENT: { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ABSENT: { color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20', icon: <XCircle className="w-3.5 h-3.5" /> },
  LATE: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', icon: <Clock className="w-3.5 h-3.5" /> },
  EXCUSED: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { data, isLoading } = useGetMyAttendanceQuery();
  const records = data?.data || [];
  const summary = data?.summary || { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 0 };

  const filtered = useMemo(() =>
    records.filter((r) =>
      (filterStatus === 'ALL' || r.status === filterStatus) &&
      r.class.module.moduleName.toLowerCase().includes(search.toLowerCase())
    ), [records, search, filterStatus]);

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
              <TrendingUp className="w-3 h-3" /> Presence Analytics
            </span>
          </div>
          <TextGenerateEffect
            words="Attendance Tracker"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Monitor your commitment and academic presence</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary group h-11">
          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Attendance Rate', value: `${summary.rate}%`, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Present', value: summary.present, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/10', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Absent', value: summary.absent, color: 'text-rose-500', bg: 'bg-rose-500/5 border-rose-500/10', icon: <XCircle className="w-4 h-4" /> },
          { label: 'Late / Excused', value: summary.late + summary.excused, color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/10', icon: <Clock className="w-4 h-4" /> },
        ].map((s) => (
          <Card key={s.label} className={cn('border backdrop-blur-xl rounded-2xl', s.bg)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={cn('text-xs font-bold uppercase tracking-widest text-muted-foreground')}>{s.label}</div>
                <div className={cn(s.color)}>{s.icon}</div>
              </div>
              <div className={cn('text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
              {s.label === 'Attendance Rate' && (
                <Progress value={summary.rate} className="mt-2 h-1.5" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by module..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((s) => (
            <button key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all',
                filterStatus === s
                  ? s === 'ALL' ? 'bg-primary-100/20 text-primary-100 border-primary-100/30'
                    : (STATUS_STYLE[s]?.bg || '') + ' ' + (STATUS_STYLE[s]?.color || '')
                  : 'text-muted-foreground border-white/10 hover:border-white/30'
              )}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-primary-100">Attendance Records</CardTitle>
            <CardDescription className="text-xs mt-0.5">Total: {summary.total} sessions</CardDescription>
          </div>
          <Badge variant="outline" className="text-primary-100 border-primary-100/30">{filtered.length} shown</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 opacity-40">
              <Calendar className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold text-sm">No records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-white/5">
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Module</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Day</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => {
                  const style = STATUS_STYLE[record.status] || STATUS_STYLE.PRESENT;
                  return (
                    <TableRow key={record.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-semibold text-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-sm">{record.class.module.moduleName}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{record.class.module.moduleCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {record.class.day}
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border', style.bg, style.color)}>
                          {style.icon}
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground italic">
                        {record.note || '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
