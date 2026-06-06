'use client';

import { useState, useMemo } from 'react';
import {
  CheckCircle, XCircle, Clock, AlertCircle, Users, BookOpen,
  Calendar, Search, ChevronDown, Save, RotateCcw, TrendingUp, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useGetClassesQuery,
  useGetClassStudentsForAttendanceQuery,
  useGetAttendanceByClassQuery,
  useMarkAttendanceMutation,
} from '@/services/adminApi';

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'ABSENT', label: 'Absent', icon: XCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { value: 'LATE', label: 'Late', icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { value: 'EXCUSED', label: 'Excused', icon: AlertCircle, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
];

export default function AdminAttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>({});

  const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
  const classes = classesData?.data || [];

  const { data: studentsData, isLoading: studentsLoading } = useGetClassStudentsForAttendanceQuery(
    Number(selectedClassId), { skip: !selectedClassId }
  );
  const students: any[] = studentsData?.data || [];

  const { data: existingData } = useGetAttendanceByClassQuery(
    { classId: Number(selectedClassId), date: selectedDate },
    { skip: !selectedClassId }
  );
  const existingRecords: any[] = existingData?.data || [];

  const [markAttendance, { isLoading: saving }] = useMarkAttendanceMutation();

  const existingMap = useMemo(() => {
    const m: Record<number, string> = {};
    existingRecords.forEach((r) => { m[r.studentId] = r.status; });
    return m;
  }, [existingRecords]);

  const effectiveMap = useMemo(() => ({ ...existingMap, ...attendanceMap }), [existingMap, attendanceMap]);

  const filteredStudents = useMemo(() =>
    students.filter((s) =>
      `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

  const setStatus = (studentId: number, status: string) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: string) => {
    const map: Record<number, string> = {};
    students.forEach((s) => { map[s.id] = status; });
    setAttendanceMap(map);
  };

  const handleSave = async () => {
    if (!selectedClassId) return;
    const records = students.map((s) => ({
      studentId: s.id,
      status: effectiveMap[s.id] || 'PRESENT',
    }));
    try {
      await markAttendance({ classId: Number(selectedClassId), date: selectedDate, records }).unwrap();
      setAttendanceMap({});
      toast.success('Attendance saved successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save attendance');
    }
  };

  const summary = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => (effectiveMap[s.id] || 'PRESENT') === 'PRESENT').length;
    const absent = students.filter((s) => effectiveMap[s.id] === 'ABSENT').length;
    const late = students.filter((s) => effectiveMap[s.id] === 'LATE').length;
    return { total, present, absent, late };
  }, [students, effectiveMap]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" /> Attendance Management
            </span>
          </div>
          <TextGenerateEffect
            words="Attendance Tracker"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Mark and manage student attendance per class session</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Class</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                  <SelectValue placeholder={classesLoading ? 'Loading...' : 'Pick a class'} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name || `Class ${c.id}`} — {c.semester || c.schedule}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: summary.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Present', value: summary.present, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Absent', value: summary.absent, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Late', value: summary.late, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((s) => (
              <Card key={s.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <div className={cn('text-3xl font-black tracking-tighter', s.color)}>{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <Button key={s.value} variant="outline" size="sm"
                  className={cn('rounded-xl border font-bold text-xs', s.color)}
                  onClick={() => markAll(s.value)}>
                  Mark All {s.label}
                </Button>
              ))}
            </div>
            <Button
              variant="premium"
              className="rounded-xl px-6 shadow-neon-primary font-bold"
              onClick={handleSave}
              disabled={saving || students.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>

          {/* Attendance Table */}
          <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-primary-100">
                  Student Roster
                </CardTitle>
                <Badge variant="outline" className="text-primary-100 border-primary-100/30">
                  {filteredStudents.length} students
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {studentsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                  <Users className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-bold text-sm">No students enrolled in this class</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5">
                      <TableHead className="font-bold text-xs uppercase tracking-widest">Student</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-widest">Email</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const currentStatus = effectiveMap[student.id] || 'PRESENT';
                      const statusOpt = STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];
                      return (
                        <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100/20 flex items-center justify-center text-primary-100 font-bold text-xs">
                                {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                              </div>
                              <span className="font-semibold text-sm">
                                {student.user?.firstName} {student.user?.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{student.user?.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1.5 flex-wrap">
                              {STATUS_OPTIONS.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => setStatus(student.id, opt.value)}
                                  className={cn(
                                    'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border transition-all',
                                    currentStatus === opt.value ? opt.color : 'text-muted-foreground bg-transparent border-white/10 hover:border-white/30'
                                  )}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClassId && (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 dark:border-slate-800/50 rounded-3xl">
          <CardContent className="py-20 text-center opacity-40">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p className="font-bold text-lg">Select a class to manage attendance</p>
            <p className="text-sm text-muted-foreground mt-1">Choose a class and date from the filters above</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
