'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers, Plus, Trash2, Edit2, Search, Users, BookOpen, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetFacultiesQuery,
  useGetDepartmentsQuery,
} from '@/services/adminApi';

const LEVELS = [
  { id: '1', levelName: 'Year 1' },
  { id: '2', levelName: 'Year 2' },
  { id: '3', levelName: 'Year 3' },
  { id: '4', levelName: 'Year 4' },
  { id: '5', levelName: 'Year 5' },
];

const SEMESTERS = [
  { id: '1', semesterName: 'Semester 1' },
  { id: '2', semesterName: 'Semester 2' },
];

type ClassForm = {
  name: string;
  code: string;
  facultyId: string;
  departmentId: string;
  levelName: string;
  semesterName: string;
  capacity: string;
};

const EMPTY_FORM: ClassForm = {
  name: '', code: '', facultyId: '', departmentId: '', levelName: '', semesterName: '', capacity: '50',
};

function generateCode(deptName: string, levelName: string, semName: string): string {
  const dept = deptName
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 4);
  const lvl = levelName.replace(/[^0-9]/g, '') || levelName.slice(0, 2).toUpperCase();
  const sem = semName ? semName.replace(/[^0-9]/g, '').slice(0, 1) : '';
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return [dept, lvl && `L${lvl}`, sem && `S${sem}`, rand].filter(Boolean).join('-');
}

export default function AdminClassesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ClassForm>({ ...EMPTY_FORM });

  const { data: classesData, isLoading } = useGetClassesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDepartmentsQuery();

  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();
  const [deleteClass, { isLoading: deleting }] = useDeleteClassMutation();

  const classes = classesData?.data ?? [];
  const faculties: any[] = facultiesData?.data ?? [];
  const allDepartments: any[] = departmentsData?.data ?? [];
  const levels = LEVELS;
  const semesters = SEMESTERS;

  const filteredDepts = useMemo(
    () => (!form.facultyId ? allDepartments : allDepartments.filter((d: any) => String(d.facultyId) === form.facultyId)),
    [allDepartments, form.facultyId],
  );

  const filtered = useMemo(() =>
    classes.filter((c) =>
      (filterFaculty === 'all' || c.facultyId === filterFaculty) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
    ), [classes, search, filterFaculty]);

  const autoGenerateCode = () => {
    const dept = allDepartments.find((d: any) => String(d.id) === form.departmentId);
    if (!dept) { toast.error('Select a department first'); return; }
    const code = generateCode(dept.deptName ?? dept.name ?? '', form.levelName, form.semesterName);
    setForm((f) => ({ ...f, code }));
  };

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); };

  const openEdit = (c: any) => {
    setForm({
      name: c.name,
      code: c.code,
      facultyId: String(c.facultyId),
      departmentId: String(c.departmentId),
      levelName: (c.level as any)?.levelName ?? '',
      semesterName: (c.semester as any)?.semesterName ?? '',
      capacity: String(c.capacity),
    });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.facultyId || !form.departmentId || !form.levelName) {
      toast.error('Name, code, faculty, department and level are required');
      return;
    }
    const payload = {
      name: form.name,
      code: form.code,
      facultyId: form.facultyId,
      departmentId: form.departmentId,
      levelName: form.levelName,
      semesterName: form.semesterName || undefined,
      capacity: Number(form.capacity) || 50,
    };
    try {
      if (editId) {
        await updateClass({ id: editId, data: payload }).unwrap();
        toast.success('Class updated');
      } else {
        const result = await createClass(payload).unwrap();
        toast.success('Class created');
        setShowForm(false);
        const newId = (result as any)?.data?.id;
        if (newId) router.push(`/admin/classes/${newId}`);
        return;
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save class');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteClass(deleteId).unwrap();
      toast.success('Class deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete class');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Classes
            </span>
          </div>
          <TextGenerateEffect
            words="Class Manager"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Create and manage classes, then set their timetables</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Class
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
            </div>
            <Select value={filterFaculty} onValueChange={setFilterFaculty}>
              <SelectTrigger className="w-[220px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20">
                <SelectValue placeholder="Filter by faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {faculties.map((f: any) => (
                  <SelectItem key={f.id} value={String(f.id)}>{f.name ?? f.facultyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Classes', value: classes.length, color: 'text-blue-500' },
          { label: 'Faculties', value: new Set(classes.map((c) => c.facultyId)).size, color: 'text-purple-500' },
          { label: 'Departments', value: new Set(classes.map((c) => c.departmentId)).size, color: 'text-emerald-500' },
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
            <CardTitle className="text-lg font-bold text-primary-100">All Classes</CardTitle>
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
              <Layers className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold text-sm">No classes found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 bg-white/5">
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Class</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Faculty</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Department</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Level</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Semester</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Capacity</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Timetable</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/admin/classes/${c.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-primary-100/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary-100" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm group-hover:text-primary-100 transition-colors">{c.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{c.code}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{(c.faculty as any)?.facultyName ?? `Faculty #${c.facultyId}`}</TableCell>
                    <TableCell className="text-sm">{(c.department as any)?.deptName ?? `Dept #${c.departmentId}`}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/20">
                        {(c.level as any)?.levelName ?? `Level #${c.levelId}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(c.semester as any)?.semesterName ?? (c.semesterId ? `Sem #${c.semesterId}` : '—')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {c.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/20">
                        {(c._count as any)?.timeTable ?? 0} slots
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary-100/10"
                          onClick={() => openEdit(c)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-rose-500"
                          onClick={() => setDeleteId(c.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
              {editId ? 'Edit Class' : 'New Class'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Faculty *</label>
              <Select value={form.facultyId} onValueChange={(v) => setForm((f) => ({ ...f, facultyId: v, departmentId: '' }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select faculty" /></SelectTrigger>
                <SelectContent>
                  {faculties.map((f: any) => <SelectItem key={f.id} value={String(f.id)}>{f.name ?? f.facultyName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Department *</label>
              <Select value={form.departmentId} onValueChange={(v) => setForm((f) => ({ ...f, departmentId: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {filteredDepts.map((d: any) => <SelectItem key={d.id} value={String(d.id)}>{d.deptName ?? d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year / Level *</label>
                <Select value={form.levelName} onValueChange={(v) => setForm((f) => ({ ...f, levelName: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => <SelectItem key={l.id} value={l.levelName}>{l.levelName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Semester</label>
                <Select value={form.semesterName || 'none'} onValueChange={(v) => setForm((f) => ({ ...f, semesterName: v === 'none' ? '' : v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {semesters.map((s) => <SelectItem key={s.id} value={s.semesterName}>{s.semesterName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Class Name *</label>
              <Input placeholder="e.g. Computer Science Year 2 Class A" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Class Code *</label>
                <button type="button" className="text-[10px] font-bold text-primary-100 hover:underline" onClick={autoGenerateCode}>
                  Auto-generate
                </button>
              </div>
              <Input placeholder="e.g. CS-L2-S1-001" value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="rounded-xl font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Student Capacity *</label>
              <Input type="number" min={1} placeholder="50" value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="premium" className="rounded-xl shadow-neon-primary" onClick={handleSubmit}
              disabled={creating || updating}>
              {(creating || updating) ? 'Saving...' : editId ? 'Update' : 'Create & Open'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class and all its timetable slots. This cannot be undone.
            </AlertDialogDescription>
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
