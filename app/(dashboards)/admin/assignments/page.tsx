'use client';

import { useState, useMemo } from 'react';
import {
  FileText, Plus, Trash2, Edit2, Search, BookOpen,
  Calendar, Clock, Award, Upload, X, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useGetAdminAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetCoursesQuery,
} from '@/services/adminApi';

type AssignmentForm = {
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: string;
};

const EMPTY_FORM: AssignmentForm = { moduleId: '', title: '', description: '', dueDate: '', maxScore: '100' };

export default function AdminAssignmentsPage() {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<AssignmentForm>(EMPTY_FORM);

  const { data: assignmentsData, isLoading } = useGetAdminAssignmentsQuery();
  const { data: coursesData } = useGetCoursesQuery();
  const [createAssignment, { isLoading: creating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: updating }] = useUpdateAssignmentMutation();
  const [deleteAssignment, { isLoading: deleting }] = useDeleteAssignmentMutation();

  const assignments: any[] = assignmentsData?.data || [];
  const courses: any[] = coursesData?.data || [];

  const filtered = useMemo(() =>
    assignments.filter((a) =>
      (filterModule === 'all' || String(a.moduleId) === filterModule) &&
      a.title.toLowerCase().includes(search.toLowerCase())
    ), [assignments, search, filterModule]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (a: any) => {
    setForm({
      moduleId: String(a.moduleId),
      title: a.title,
      description: a.description || '',
      dueDate: a.dueDate?.split('T')[0] || '',
      maxScore: String(a.maxScore),
    });
    setEditId(a.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.moduleId || !form.title || !form.dueDate) {
      toast.error('Module, title and due date are required');
      return;
    }
    const payload = {
      moduleId: Number(form.moduleId),
      title: form.title,
      description: form.description || undefined,
      dueDate: form.dueDate,
      maxScore: Number(form.maxScore) || 100,
    };
    try {
      if (editId) {
        await updateAssignment({ id: editId, data: payload }).unwrap();
        toast.success('Assignment updated');
      } else {
        await createAssignment(payload).unwrap();
        toast.success('Assignment created');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save assignment');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAssignment(deleteId).unwrap();
      toast.success('Assignment deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const getDueBadge = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: 'Overdue', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
    if (diff <= 3) return { label: 'Due Soon', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Upcoming', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  };

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
          <TextGenerateEffect
            words="Assignment Manager"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Create and manage assignments for each module</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Assignment
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
            </div>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-[200px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: assignments.length, color: 'text-blue-500' },
          { label: 'Due Soon', value: assignments.filter((a) => { const d = new Date(a.dueDate); const n = new Date(); return (d.getTime() - n.getTime()) / 86400000 <= 3 && d > n; }).length, color: 'text-amber-500' },
          { label: 'Overdue', value: assignments.filter((a) => new Date(a.dueDate) < new Date()).length, color: 'text-rose-500' },
        ].map((s) => (
          <Card key={s.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className={cn('text-3xl font-black', s.color)}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary-100">All Assignments</CardTitle>
            <Badge variant="outline" className="text-primary-100 border-primary-100/30">{filtered.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 opacity-40">
              <FileText className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold text-sm">No assignments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-white/5">
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Title</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Module</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Due Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Max Score</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => {
                  const dueBadge = getDueBadge(a.dueDate);
                  return (
                    <TableRow key={a.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div className="font-semibold text-sm">{a.title}</div>
                        {a.description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.description}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-xs">
                          {a.module?.moduleCode} — {a.module?.moduleName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(a.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold text-sm">{a.maxScore}</TableCell>
                      <TableCell>
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase border', dueBadge.color)}>
                          {dueBadge.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary-100/10"
                            onClick={() => openEdit(a)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-rose-500"
                            onClick={() => setDeleteId(a.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-100">
              {editId ? 'Edit Assignment' : 'New Assignment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Module *</label>
              <Select value={form.moduleId} onValueChange={(v) => setForm((f) => ({ ...f, moduleId: v }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title *</label>
              <Input placeholder="Assignment title" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea
                placeholder="Instructions or description..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-100/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Due Date *</label>
                <Input type="date" value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Score</label>
                <Input type="number" placeholder="100" value={form.maxScore}
                  onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="premium" className="rounded-xl shadow-neon-primary" onClick={handleSubmit}
              disabled={creating || updating}>
              {(creating || updating) ? 'Saving...' : editId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the assignment. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-xl bg-rose-500 hover:bg-rose-600" onClick={handleDelete} disabled={deleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
