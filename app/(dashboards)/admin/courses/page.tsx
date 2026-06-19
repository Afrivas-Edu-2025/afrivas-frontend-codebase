'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  Layers,
  GraduationCap,
  RefreshCw,
  LayoutGrid,
  Activity,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import CreateCourseForm from '@/components/forms/CreateCourseForm';
import { useDeleteCourseMutation, useGetCoursesQuery } from '@/services/adminApi';
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

export default function CoursesPage() {
  const ITEMS_PER_PAGE = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: coursesData, isLoading, error, refetch } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  const courses = coursesData?.data || [];
  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...courses].sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!term) return sorted;
    return sorted.filter((course: any) =>
      course.name.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete.id).unwrap();
      toast.success('Module deleted successfully');
      refetch();
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Failed to delete module');
    } finally {
      setCourseToDelete(null);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading modules...</p>
    </div>
  );

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-tight mb-1">
            <LayoutGrid className="w-3.5 h-3.5 mr-2" />
            Modules
          </div>
          <TextGenerateEffect
            words="Module Management"
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic tracking-tight"
          />
          <p className="text-muted-foreground font-medium max-w-xl">Manage academic modules and the lecturers assigned to teach them.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl h-12 px-6 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold text-sm hover:bg-primary-100/5 transition-all"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <CreateCourseForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Modules"
          value={courses.length.toString()}
          description="Active modules"
          icon={<BookOpen className="w-4 h-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
          trend={`${courses.length} total`}
        />
        <SummaryCard
          title="With Lecturers"
          value={courses.filter((c: any) => c.lecturers?.length > 0).length.toString()}
          description="Modules assigned to a lecturer"
          icon={<Layers className="w-4 h-4 text-purple-500" />}
          color="text-purple-500"
          glow="shadow-purple-500/10"
          trend="Assigned"
        />
        <SummaryCard
          title="Unassigned"
          value={courses.filter((c: any) => !c.lecturers?.length).length.toString()}
          description="No lecturer assigned yet"
          icon={<Activity className="w-4 h-4 text-amber-500" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
          trend="Pending assignment"
        />
        <SummaryCard
          title="Completion Rate"
          value="92%"
          description="Overall student pass rate"
          icon={<GraduationCap className="w-4 h-4 text-emerald-500" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
          trend="+1.2% this semester"
        />
      </div>

      {/* Search */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Search by module name or code..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-sm font-bold"
                />
              </div>
            </div>
            <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-bold text-sm h-12 px-8">
              Advanced Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-primary-100 italic">All Modules</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1">All academic modules registered in the system</CardDescription>
          </div>
          <Badge variant="glass" className="font-bold text-[10px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-4 py-1.5">{courses.length} Modules</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="px-8 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Module Name</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Code</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Lecturers</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Created</TableHead>
                  <TableHead className="px-8 py-6 text-right text-xs font-bold text-muted-foreground tracking-tight">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCourses.map((course: any) => (
                  <tr key={course.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <BookOpen size={18} />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight italic">{course.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="glass" className="bg-primary-100/10 text-primary-100 border-primary-100/20 text-[10px] font-bold px-3">
                        {course.code}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {(course.lecturers ?? []).length === 0 ? (
                          <span className="text-[10px] font-bold text-muted-foreground opacity-40 italic">None assigned</span>
                        ) : (
                          (course.lecturers ?? []).map((l: any) => (
                            <Badge key={l.id} variant="glass" className="bg-primary-100/10 text-primary-100 border-primary-100/20 text-[10px] font-bold px-2 py-0.5">
                              {l.firstName} {l.lastName}
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-muted-foreground opacity-40 italic">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-primary-100 hover:bg-primary-100/10 rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        onClick={() => setCourseToDelete({ id: course.id, name: course.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-white/5 text-muted-foreground opacity-20">
                <LayoutGrid size={64} />
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-widest">No modules found</p>
              <Button variant="outline" className="rounded-xl border-white/20" onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-bold text-muted-foreground tracking-tight">
              Showing <span className="text-primary-100">{paginatedCourses.length}</span> of {filteredCourses.length} modules
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl font-bold text-xs hover:bg-primary-100/10 px-4 h-9"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "premium" : "ghost"}
                    size="sm"
                    className={cn("w-9 h-9 rounded-xl text-xs font-bold", p !== currentPage && "hover:bg-primary-100/10")}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl font-bold text-xs hover:bg-primary-100/10 px-4 h-9"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-white/20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl p-10">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mb-6">
            <Activity size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Delete Module</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-rose-500 text-sm leading-relaxed mt-2">
              Are you sure you want to delete <strong>{courseToDelete?.name}</strong>? This will permanently remove the module and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl border-white/20 font-bold text-sm h-11 px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm h-11 px-8 border-none shadow-lg shadow-rose-500/20 text-white">Delete</AlertDialogAction>
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
