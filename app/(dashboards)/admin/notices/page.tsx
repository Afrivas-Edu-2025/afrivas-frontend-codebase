'use client';

import { useState, useMemo } from 'react';
import {
  Bell, Plus, Trash2, Edit2, Search, Users, BookOpen, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  useGetAdminNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  useGetCoursesQuery,
} from '@/services/adminApi';

type NoticeForm = { moduleId: string; title: string; body: string; visibility: string };
const EMPTY_FORM: NoticeForm = { moduleId: '', title: '', body: '', visibility: 'ALL' };

const VISIBILITY_OPTS = [
  { value: 'ALL', label: 'Everyone', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { value: 'STUDENTS', label: 'Students Only', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'LECTURERS', label: 'Lecturers Only', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
];

export default function AdminNoticesPage() {
  const [search, setSearch] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewNotice, setViewNotice] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<NoticeForm>(EMPTY_FORM);

  const { data: noticesData, isLoading } = useGetAdminNoticesQuery();
  const { data: coursesData } = useGetCoursesQuery();
  const [createNotice, { isLoading: creating }] = useCreateNoticeMutation();
  const [updateNotice, { isLoading: updating }] = useUpdateNoticeMutation();
  const [deleteNotice, { isLoading: deleting }] = useDeleteNoticeMutation();

  const notices: any[] = noticesData?.data || [];
  const courses: any[] = coursesData?.data || [];

  const filtered = useMemo(() =>
    notices.filter((n) =>
      (filterVisibility === 'all' || n.visibility === filterVisibility) &&
      (n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
    ), [notices, search, filterVisibility]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (n: any) => {
    setForm({ moduleId: n.moduleId ? String(n.moduleId) : '', title: n.title, body: n.body, visibility: n.visibility });
    setEditId(n.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.body) { toast.error('Title and body are required'); return; }
    const payload = {
      title: form.title,
      body: form.body,
      visibility: form.visibility as any,
      moduleId: form.moduleId ? Number(form.moduleId) : undefined,
    };
    try {
      if (editId) {
        await updateNotice({ id: editId, data: payload }).unwrap();
        toast.success('Notice updated');
      } else {
        await createNotice(payload).unwrap();
        toast.success('Notice published');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save notice');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNotice(deleteId).unwrap();
      toast.success('Notice deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const getVisibilityBadge = (v: string) => VISIBILITY_OPTS.find((o) => o.value === v) || VISIBILITY_OPTS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-3 h-3" /> Announcements
            </span>
          </div>
          <TextGenerateEffect
            words="Notice Board"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Post announcements and notices for students and lecturers</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Post Notice
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20" />
            </div>
            <Select value={filterVisibility} onValueChange={setFilterVisibility}>
              <SelectTrigger className="w-[180px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20">
                <SelectValue placeholder="All visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ALL">Everyone</SelectItem>
                <SelectItem value="STUDENTS">Students</SelectItem>
                <SelectItem value="LECTURERS">Lecturers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-white/20 dark:bg-slate-900/20 border border-dashed border-white/20 rounded-3xl">
          <CardContent className="py-16 text-center opacity-40">
            <Bell className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-sm">No notices found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((notice) => {
            const vis = getVisibilityBadge(notice.visibility);
            return (
              <Card key={notice.id}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary-100 transition-colors">
                      {notice.title}
                    </h3>
                    <span className={cn('shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border', vis.color)}>
                      {vis.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{notice.body}</p>
                  {notice.module && (
                    <Badge variant="outline" className="text-primary-100 border-primary-100/20 text-xs">
                      {notice.module.moduleCode} — {notice.module.moduleName}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-blue-500/10 text-blue-500"
                        onClick={() => setViewNotice(notice)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary-100/10"
                        onClick={() => openEdit(notice)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-rose-500"
                        onClick={() => setDeleteId(notice.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewNotice} onOpenChange={(o) => !o && setViewNotice(null)}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{viewNotice?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {viewNotice?.module && (
              <Badge variant="outline" className="text-primary-100 border-primary-100/20">
                {viewNotice.module.moduleCode} — {viewNotice.module.moduleName}
              </Badge>
            )}
            <p className="text-sm leading-relaxed">{viewNotice?.body}</p>
            <div className="text-xs text-muted-foreground">
              Posted {viewNotice ? new Date(viewNotice.createdAt).toLocaleString() : ''}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setViewNotice(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-100">
              {editId ? 'Edit Notice' : 'Post New Notice'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title *</label>
              <Input placeholder="Notice title" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message *</label>
              <textarea
                placeholder="Write your announcement..."
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-100/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audience</label>
                <Select value={form.visibility} onValueChange={(v) => setForm((f) => ({ ...f, visibility: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Everyone</SelectItem>
                    <SelectItem value="STUDENTS">Students Only</SelectItem>
                    <SelectItem value="LECTURERS">Lecturers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Module (optional)</label>
                <Select value={form.moduleId} onValueChange={(v) => setForm((f) => ({ ...f, moduleId: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All modules</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="premium" className="rounded-xl shadow-neon-primary" onClick={handleSubmit}
              disabled={creating || updating}>
              {(creating || updating) ? 'Publishing...' : editId ? 'Update' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the notice. Students will no longer see it.</AlertDialogDescription>
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
