'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  GraduationCap,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import CreateFacultyForm from '@/components/forms/CreateFacultyForm'
import { useDeleteFacultyMutation, useGetFacultiesQuery } from '@/services/adminApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function FacultyPage() {
  const ITEMS_PER_PAGE = 20
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [facultyToDelete, setFacultyToDelete] = useState<{ id: string; name: string } | null>(null)

  const { data: facultiesData, isLoading, error, refetch } = useGetFacultiesQuery()
  const [deleteFaculty] = useDeleteFacultyMutation()

  const faculties = facultiesData?.data || []
  const filteredFaculties = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const sorted = [...faculties].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (!term) return sorted
    return sorted.filter((faculty) =>
      faculty.name.toLowerCase().includes(term) ||
      (faculty.description || '').toLowerCase().includes(term),
    )
  }, [faculties, searchTerm])
  const totalPages = Math.max(1, Math.ceil(filteredFaculties.length / ITEMS_PER_PAGE))
  const paginatedFaculties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFaculties.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFaculties, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const totalDepartments = faculties.reduce((total, faculty) => total + (faculty.departmentCount || 0), 0)
  const totalStudents = faculties.reduce((total, faculty) => total + (faculty.studentCount || 0), 0)
  const totalLecturers = faculties.reduce((total, faculty) => total + (faculty.lecturerCount || 0), 0)

  const handleDeleteFaculty = async () => {
    if (!facultyToDelete) return
    try {
      await deleteFaculty(facultyToDelete.id).unwrap()
      toast.success('Faculty deleted successfully')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Failed to delete faculty')
    } finally {
      setFacultyToDelete(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-widest mb-1">
            Institutional Structure
          </div>
          <TextGenerateEffect
            words="Faculty Administration"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium">Coordinate primary academic divisions and resource allocation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-white/20 dark:border-slate-800/50 hover:bg-primary-100/5 transition-all"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <CreateFacultyForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Faculties", value: faculties.length, icon: Building2, color: "from-blue-500 to-cyan-500" },
          { label: "Departments", value: totalDepartments, icon: GraduationCap, color: "from-purple-500 to-pink-500" },
          { label: "Students", value: totalStudents, icon: Users, color: "from-emerald-500 to-teal-500" },
          { label: "Lecturers", value: totalLecturers, icon: Users, color: "from-amber-500 to-orange-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary-100" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Search className="h-4 w-4 text-primary-100" />
            Faculty Discovery
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-wider">Search by administrative name or division description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
            <Input
              placeholder="Search faculties by identity or scope..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100 transition-all font-medium"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="border-b border-white/10 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Registry of Faculties</CardTitle>
              <CardDescription className="font-medium">Primary academic divisions and their respective scale</CardDescription>
            </div>
            <div className="text-xs font-extrabold text-primary-100 uppercase tracking-widest px-3 py-1 bg-primary-100/10 rounded-full border border-primary-100/20">
              {filteredFaculties.length} Records Loaded
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100/20 border-t-primary-100 rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary-100 uppercase tracking-widest">Synchronizing records...</p>
            </div>
          ) : filteredFaculties.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No faculties identified.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Headcount</TableHead>
                    <TableHead>Staffing</TableHead>
                    <TableHead className="text-right">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFaculties.map((faculty) => (
                    <TableRow key={faculty.id} className="group transition-all duration-300">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100/20 to-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {faculty.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors uppercase tracking-tight">{faculty.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium text-muted-foreground italic text-xs">
                        {faculty.description || 'Null specification'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="glass" className="bg-purple-500/5 text-purple-500 border-purple-500/20 lowercase tracking-normal">
                          {faculty.departmentCount || 0} dept
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 lowercase tracking-normal font-mono">
                          {faculty.studentCount || 0} students
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/5 lowercase tracking-normal font-mono">
                          {faculty.lecturerCount || 0} lecturers
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          onClick={() => setFacultyToDelete({ id: faculty.id, name: faculty.name })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredFaculties.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Displaying <span className="text-primary-100">{paginatedFaculties.length}</span> of {filteredFaculties.length} Entries
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/20 bg-white/50 dark:bg-slate-800/50 shadow-sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 text-xs font-black text-primary-100">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="premium"
                  size="sm"
                  className="rounded-xl px-5 shadow-neon-primary"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!facultyToDelete} onOpenChange={() => setFacultyToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Organizational Termination</AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-red-500">
              Executing this command will permanently remove <strong>{facultyToDelete?.name}</strong> and potentially decouple all associated departments and staff members. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-white/20">Abort Process</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFaculty} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold border-none shadow-lg shadow-red-500/20">Confirm Destruction</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
