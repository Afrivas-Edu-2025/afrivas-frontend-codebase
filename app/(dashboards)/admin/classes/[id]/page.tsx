'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, CalendarDays, Clock, MapPin, Plus, Trash2, Edit2,
  Users, BookOpen, Building2, Layers, AlertTriangle, Check, X, GraduationCap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useGetClassByIdQuery,
  useGetTimetablesByClassQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,
  useGetClassroomsQuery,
  useCreateClassroomMutation,
  useGetCoursesQuery,
  useGetAllLecturersQuery,
} from '@/services/adminApi';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
type DayKey = typeof DAYS[number];

type SessionDraft = {
  moduleId: string;
  lecturerId: string;
  classroomId: string;
  startTime: string;
  endTime: string;
};

// A slot in the timetable modal — tracks whether it maps to an existing DB entry
type TimetableSlot = {
  existingId: string | null;
  draft: SessionDraft;
};

const EMPTY_SESSION: SessionDraft = { moduleId: '', lecturerId: '', classroomId: '', startTime: '', endTime: '' };

function timeToIso(t: string) {
  if (!t) return '';
  return `1970-01-01T${t}:00.000Z`;
}

function isoToTime(iso: string) {
  if (!iso) return '';
  try { return new Date(iso).toISOString().slice(11, 16); } catch { return iso.slice(11, 16) || ''; }
}

function formatTime(iso: string) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }); } catch { return iso; }
}

function timesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  const toMins = (t: string) => { const d = new Date(t); return d.getHours() * 60 + d.getMinutes(); };
  try {
    const [a, b, c, d] = [toMins(s1), toMins(e1), toMins(s2), toMins(e2)];
    return a < d && b > c;
  } catch { return false; }
}

const DAY_COLORS: Record<string, string> = {
  MONDAY:    'bg-blue-500/10 border-blue-500/20 text-blue-500',
  TUESDAY:   'bg-purple-500/10 border-purple-500/20 text-purple-500',
  WEDNESDAY: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
  THURSDAY:  'bg-amber-500/10 border-amber-500/20 text-amber-500',
  FRIDAY:    'bg-rose-500/10 border-rose-500/20 text-rose-500',
  SATURDAY:  'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
};

// ---- Classroom quick-create inline ----
function ClassroomQuickCreate({ onCreated }: { onCreated: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [create, { isLoading }] = useCreateClassroomMutation();

  const handleCreate = async () => {
    if (!name) { toast.error('Name is required'); return; }
    try {
      const res = await create({ name, location: location || undefined, capacity: capacity ? Number(capacity) : undefined }).unwrap();
      toast.success('Classroom created');
      onCreated(String((res as any)?.data?.id ?? ''));
      setOpen(false); setName(''); setLocation(''); setCapacity('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create classroom');
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-[10px] font-bold text-primary-100 hover:underline whitespace-nowrap">
        + New Room
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-sm">
          <DialogHeader><DialogTitle className="text-base font-bold text-primary-100">New Classroom</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Room name *" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
            <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl" />
            <Input type="number" placeholder="Capacity (optional)" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="premium" size="sm" className="rounded-xl" onClick={handleCreate} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---- Session form for one day ----
function SessionForm({
  day, slot, onChangeSlot, onRemove, modules, lecturers, classrooms, allTimetable,
}: {
  day: string;
  slot: TimetableSlot;
  onChangeSlot: (s: SessionDraft) => void;
  onRemove: () => void;
  modules: any[];
  lecturers: any[];
  classrooms: any[];
  allTimetable: any[];
}) {
  const session = slot.draft;

  const conflict = useMemo(() => {
    if (!session.lecturerId || !session.startTime || !session.endTime) return false;
    return allTimetable.some((t) => {
      if (String(t.lecturerId) !== session.lecturerId) return false;
      if (t.day !== day) return false;
      if (slot.existingId && String(t.id) === slot.existingId) return false;
      return timesOverlap(timeToIso(session.startTime), timeToIso(session.endTime), t.startTime, t.endTime);
    });
  }, [session, day, allTimetable, slot.existingId]);

  return (
    <div className="relative space-y-3 p-4 bg-white/20 dark:bg-slate-800/20 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between">
        <div className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase border', DAY_COLORS[day] ?? 'text-muted-foreground border-muted/30')}>
          {day}
          {slot.existingId && (
            <span className="ml-1.5 text-[8px] opacity-60 normal-case font-normal">saved</span>
          )}
        </div>
        <button type="button" onClick={onRemove} className="p-1 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Module *</label>
          <Select value={session.moduleId} onValueChange={(v) => onChangeSlot({ ...session, moduleId: v })}>
            <SelectTrigger className="rounded-xl h-9 text-xs"><SelectValue placeholder="Select module" /></SelectTrigger>
            <SelectContent>
              {modules.map((m: any) => (
                <SelectItem key={m.id} value={String(m.id)} className="text-xs">
                  {m.moduleCode ?? m.code} — {m.moduleName ?? m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lecturer</label>
            {conflict && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500">
                <AlertTriangle className="w-3 h-3" /> Conflict
              </span>
            )}
          </div>
          <Select value={session.lecturerId || 'none'} onValueChange={(v) => onChangeSlot({ ...session, lecturerId: v === 'none' ? '' : v })}>
            <SelectTrigger className={cn('rounded-xl h-9 text-xs', conflict && 'border-rose-500/50 bg-rose-500/5')}>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">Unassigned</SelectItem>
              {lecturers.map((l: any) => {
                const lId = String(l.id);
                const busy = session.startTime && session.endTime && allTimetable.some((t) =>
                  t.day === day && String(t.lecturerId) === lId &&
                  (!slot.existingId || String(t.id) !== slot.existingId) &&
                  timesOverlap(timeToIso(session.startTime), timeToIso(session.endTime), t.startTime, t.endTime)
                );
                return (
                  <SelectItem key={l.id} value={lId} className={cn('text-xs', busy && 'text-rose-500')}>
                    {l.firstName} {l.lastName}{busy ? ' ⚠ busy' : ''}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Time *</label>
          <Input type="time" value={session.startTime} onChange={(e) => onChangeSlot({ ...session, startTime: e.target.value })} className="rounded-xl h-9 text-xs" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">End Time *</label>
          <Input type="time" value={session.endTime} onChange={(e) => onChangeSlot({ ...session, endTime: e.target.value })} className="rounded-xl h-9 text-xs" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Classroom</label>
          <ClassroomQuickCreate onCreated={(cid) => onChangeSlot({ ...session, classroomId: cid })} />
        </div>
        <Select value={session.classroomId || 'none'} onValueChange={(v) => onChangeSlot({ ...session, classroomId: v === 'none' ? '' : v })}>
          <SelectTrigger className="rounded-xl h-9 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-xs">None</SelectItem>
            {classrooms.map((r: any) => (
              <SelectItem key={r.id} value={String(r.id)} className="text-xs">
                {r.name}{r.location ? ` — ${r.location}` : ''}{r.capacity ? ` (${r.capacity})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: classData, isLoading: classLoading } = useGetClassByIdQuery(id);
  const { data: timetableData, isLoading: ttLoading } = useGetTimetablesByClassQuery(id);
  const { data: modulesData } = useGetCoursesQuery();
  const { data: lecturersData } = useGetAllLecturersQuery({ limit: 200 });
  const { data: classroomsData } = useGetClassroomsQuery();

  const [createTimetable, { isLoading: creating }] = useCreateTimetableMutation();
  const [updateTimetable, { isLoading: updating }] = useUpdateTimetableMutation();
  const [deleteTimetable, { isLoading: deleting }] = useDeleteTimetableMutation();

  const cls = classData?.data;
  const timetable = timetableData?.data ?? [];
  const modules: any[] = modulesData?.data ?? [];
  const lecturers: any[] = lecturersData?.data ?? [];
  const classrooms: any[] = classroomsData?.data ?? [];

  const hasTimetable = timetable.length > 0;

  // ---- Unified timetable modal state ----
  const [showTTModal, setShowTTModal] = useState(false);
  const [ttModalMode, setTtModalMode] = useState<'add' | 'edit'>('add');
  // day → slot (one slot per day in the modal)
  const [ttSlots, setTtSlots] = useState<Record<string, TimetableSlot>>({});
  // tracks entries that had an existing DB row but were removed in the modal
  const [pendingDeletes, setPendingDeletes] = useState<{ id: string; day: string }[]>([]);

  // ---- Inline edit for a single entry (from the timetable view) ----
  const [editEntry, setEditEntry] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<SessionDraft>({ ...EMPTY_SESSION });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ---- Group timetable by day ----
  const byDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    timetable.forEach((t) => { if (!map[t.day]) map[t.day] = []; map[t.day].push(t); });
    return map;
  }, [timetable]);

  // Days already covered in the modal
  const activeDays = Object.keys(ttSlots);
  const availableDays = DAYS.filter((d) => !ttSlots[d]);

  const openAddModal = () => {
    setTtSlots({});
    setPendingDeletes([]);
    setTtModalMode('add');
    setShowTTModal(true);
  };

  const openEditModal = () => {
    // Pre-populate with first existing entry per day
    const slots: Record<string, TimetableSlot> = {};
    const seen = new Set<string>();
    timetable.forEach((entry: any) => {
      if (!seen.has(entry.day)) {
        seen.add(entry.day);
        slots[entry.day] = {
          existingId: String(entry.id),
          draft: {
            moduleId: String(entry.moduleId ?? ''),
            lecturerId: entry.lecturerId ? String(entry.lecturerId) : '',
            classroomId: entry.classroomId ? String(entry.classroomId) : '',
            startTime: isoToTime(entry.startTime),
            endTime: isoToTime(entry.endTime),
          },
        };
      }
    });
    setTtSlots(slots);
    setPendingDeletes([]);
    setTtModalMode('edit');
    setShowTTModal(true);
  };

  const addDayToModal = (day: DayKey) => {
    if (ttSlots[day]) return;
    setTtSlots((prev) => ({ ...prev, [day]: { existingId: null, draft: { ...EMPTY_SESSION } } }));
  };

  const removeDayFromModal = (day: string) => {
    const slot = ttSlots[day];
    if (slot?.existingId) {
      setPendingDeletes((prev) => [...prev, { id: slot.existingId!, day }]);
    }
    setTtSlots((prev) => { const n = { ...prev }; delete n[day]; return n; });
  };

  const updateSlotDraft = (day: string, draft: SessionDraft) => {
    setTtSlots((prev) => ({ ...prev, [day]: { ...prev[day], draft } }));
  };

  const handleSaveTimetable = async () => {
    const entries = Object.entries(ttSlots);
    const invalid = entries.filter(([_, slot]) => !slot.draft.moduleId || !slot.draft.startTime || !slot.draft.endTime);
    if (invalid.length > 0) { toast.error('Each day must have a module, start time and end time'); return; }

    let saved = 0;
    let failed = 0;

    for (const [day, slot] of entries) {
      const payload = {
        classId: id,
        moduleId: slot.draft.moduleId,
        lecturerId: slot.draft.lecturerId || undefined,
        classroomId: slot.draft.classroomId || undefined,
        day,
        startTime: timeToIso(slot.draft.startTime),
        endTime: timeToIso(slot.draft.endTime),
      };
      try {
        if (slot.existingId) {
          await updateTimetable({ id: slot.existingId, data: payload }).unwrap();
        } else {
          await createTimetable(payload).unwrap();
        }
        saved++;
      } catch (err: any) {
        toast.error(`${day}: ${err?.data?.message || 'Save failed'}`);
        failed++;
      }
    }

    for (const { id: entryId, day } of pendingDeletes) {
      try {
        await deleteTimetable({ id: entryId, classId: id }).unwrap();
      } catch (err: any) {
        toast.error(`Could not remove ${day}: ${err?.data?.message || 'Error'}`);
        failed++;
      }
    }

    if (saved > 0) {
      toast.success(ttModalMode === 'add'
        ? `${saved} slot${saved !== 1 ? 's' : ''} added`
        : 'Timetable saved successfully');
    }
    setShowTTModal(false);
  };

  const openEdit = (entry: any) => {
    setEditEntry(entry);
    setEditForm({
      moduleId: String(entry.moduleId ?? ''),
      lecturerId: entry.lecturerId ? String(entry.lecturerId) : '',
      classroomId: entry.classroomId ? String(entry.classroomId) : '',
      startTime: isoToTime(entry.startTime),
      endTime: isoToTime(entry.endTime),
    });
  };

  const handleUpdate = async () => {
    if (!editForm.moduleId || !editForm.startTime || !editForm.endTime) {
      toast.error('Module, start time and end time are required');
      return;
    }
    try {
      await updateTimetable({
        id: String(editEntry.id),
        data: {
          classId: id,
          moduleId: editForm.moduleId,
          lecturerId: editForm.lecturerId || undefined,
          classroomId: editForm.classroomId || undefined,
          day: editEntry.day,
          startTime: timeToIso(editForm.startTime),
          endTime: timeToIso(editForm.endTime),
        },
      }).unwrap();
      toast.success('Timetable entry updated');
      setEditEntry(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTimetable({ id: deleteId, classId: id }).unwrap();
      toast.success('Timetable entry deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete');
    } finally { setDeleteId(null); }
  };

  const isSaving = creating || updating || deleting;

  if (classLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="text-center py-20 opacity-40">
        <Layers className="w-12 h-12 mx-auto mb-3" />
        <p className="font-bold">Class not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/admin/classes')}>Back to Classes</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Back + Header */}
      <div>
        <Button variant="ghost" className="mb-4 rounded-xl text-muted-foreground hover:text-primary-100 -ml-2"
          onClick={() => router.push('/admin/classes')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> All Classes
        </Button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {cls.name}
              </h1>
              <Badge variant="outline" className="font-mono text-primary-100 border-primary-100/30">{cls.code}</Badge>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Class info and timetable management</p>
          </div>
          {/* Button switches based on whether timetable exists */}
          {hasTimetable ? (
            <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary" onClick={openEditModal}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Timetable
            </Button>
          ) : (
            <Button variant="premium" className="rounded-xl px-6 shadow-neon-primary" onClick={openAddModal}>
              <CalendarDays className="w-4 h-4 mr-2" /> Add Timetable Slots
            </Button>
          )}
        </div>
      </div>

      {/* Class Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Building2, label: 'Faculty',    value: (cls.faculty as any)?.facultyName ?? `Faculty #${cls.facultyId}`,        color: 'text-blue-500' },
          { icon: BookOpen,  label: 'Department', value: (cls.department as any)?.deptName ?? `Dept #${cls.departmentId}`,         color: 'text-purple-500' },
          { icon: GraduationCap, label: 'Level',  value: (cls.level as any)?.levelName ?? `Level #${cls.levelId}`,                color: 'text-amber-500' },
          { icon: Users,     label: 'Capacity',   value: `${cls.capacity} students`,                                               color: 'text-emerald-500' },
        ].map((item) => (
          <Card key={item.label} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50', item.color)}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="text-sm font-bold mt-0.5">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {cls.semester && (
        <p className="text-sm text-muted-foreground -mt-4">
          Semester: <span className="font-bold text-primary-100">{(cls.semester as any)?.semesterName}</span>
        </p>
      )}

      {/* Timetable Section */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-primary-100 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Timetable
            </CardTitle>
            <Badge variant="outline" className="text-primary-100 border-primary-100/30">{timetable.length} sessions</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {ttLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
            </div>
          ) : timetable.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <CalendarDays className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold text-sm">No timetable slots yet</p>
              <p className="text-xs mt-1">Click "Add Timetable Slots" to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {DAYS.filter((d) => byDay[d]?.length).map((day) => (
                <div key={day}>
                  <div className={cn('inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border mb-3', DAY_COLORS[day])}>
                    {day}
                  </div>
                  <div className="space-y-2">
                    {byDay[day].map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between bg-white/30 dark:bg-slate-800/30 rounded-2xl px-4 py-3 border border-white/10 group">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {entry.module?.moduleCode ?? entry.module?.code ?? `Module #${entry.moduleId}`}
                              {' — '}
                              {entry.module?.moduleName ?? entry.module?.name ?? ''}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              {entry.lecturer?.user && (
                                <span className="text-xs text-muted-foreground">
                                  {entry.lecturer.user.firstName} {entry.lecturer.user.lastName}
                                </span>
                              )}
                              {entry.classroom && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />{entry.classroom.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary-100/10"
                            onClick={() => openEdit(entry)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-rose-500"
                            onClick={() => setDeleteId(String(entry.id))}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Days not in the DAYS const order */}
              {Object.keys(byDay).filter((d) => !(DAYS as readonly string[]).includes(d)).map((day) => (
                <div key={day}>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border mb-3 text-muted-foreground border-muted/30">
                    {day}
                  </div>
                  <div className="space-y-2">
                    {byDay[day].map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between bg-white/30 dark:bg-slate-800/30 rounded-2xl px-4 py-3 border border-white/10 group">
                        <span className="text-sm font-semibold">{entry.module?.moduleName ?? `Module #${entry.moduleId}`}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => openEdit(entry)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500" onClick={() => setDeleteId(String(entry.id))}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Add / Edit Timetable Modal */}
      <Dialog open={showTTModal} onOpenChange={(v) => { if (!v) setShowTTModal(false); }}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-100">
              {ttModalMode === 'edit' ? 'Edit Timetable' : 'Add Timetable Slots'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {ttModalMode === 'edit'
                ? 'Update the existing sessions, remove days, or add new ones. Changes apply on Save.'
                : "Select the days this class runs and fill in each session's details."}
            </p>
          </DialogHeader>

          {/* Existing + new slot forms */}
          {activeDays.length > 0 && (
            <div className="space-y-3 pt-2">
              {activeDays.map((day) => (
                <SessionForm
                  key={day}
                  day={day}
                  slot={ttSlots[day]}
                  onChangeSlot={(draft) => updateSlotDraft(day, draft)}
                  onRemove={() => removeDayFromModal(day)}
                  modules={modules}
                  lecturers={lecturers}
                  classrooms={classrooms}
                  allTimetable={timetable}
                />
              ))}
            </div>
          )}

          {/* Day picker — shows only days not yet in the modal */}
          {availableDays.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {activeDays.length > 0 ? 'Add another day' : 'Select days *'}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => addDayToModal(day)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/20 dark:bg-slate-800/20 border-white/20 text-muted-foreground hover:border-primary-100/40 hover:text-primary-100 transition-all"
                  >
                    <Plus className="w-3 h-3" />{day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeDays.length === 0 && availableDays.length === DAYS.length && (
            <p className="text-center text-xs text-muted-foreground py-6 opacity-50">Select at least one day above</p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowTTModal(false)}>Cancel</Button>
            <Button
              variant="premium"
              className="rounded-xl shadow-neon-primary"
              onClick={handleSaveTimetable}
              disabled={isSaving || activeDays.length === 0}
            >
              {isSaving ? 'Saving...' : ttModalMode === 'edit' ? 'Save Changes' : `Add ${activeDays.length} Slot${activeDays.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick inline edit modal (from row hover → Edit icon) */}
      <Dialog open={!!editEntry} onOpenChange={(o) => !o && setEditEntry(null)}>
        <DialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary-100">Edit Slot — {editEntry?.day}</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <SessionForm
              day={editEntry.day}
              slot={{ existingId: String(editEntry.id), draft: editForm }}
              onChangeSlot={setEditForm}
              onRemove={() => setEditEntry(null)}
              modules={modules}
              lecturers={lecturers}
              classrooms={classrooms}
              allTimetable={timetable}
            />
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setEditEntry(null)}>Cancel</Button>
            <Button variant="premium" className="rounded-xl shadow-neon-primary" onClick={handleUpdate} disabled={updating}>
              {updating ? 'Saving...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timetable Slot</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this timetable session.</AlertDialogDescription>
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
