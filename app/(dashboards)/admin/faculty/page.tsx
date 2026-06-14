'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  GraduationCap,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Building,
  Sparkles,
  Layers,
  Activity,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  AlertCircle
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
      toast.success('Faculty sector decoupled successfully')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Decoupling protocol failed')
    } finally {
      setFacultyToDelete(null)
    }
  }

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Synchronizing Sector Registry...</p>
    </div>
  );

  return (
    <div className="space-y-10 p-2 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-tight mb-1">
            <Building2 className="w-3.5 h-3.5 mr-2" />
            Institutional Architecture
          </div>
          <TextGenerateEffect
            words="Faculty Control"
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic tracking-tight"
          />
          <p className="text-muted-foreground font-medium max-w-xl">Coordination and administrative oversight of primary academic divisions and strategic resource allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl h-12 px-6 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold text-sm hover:bg-primary-100/5 transition-all"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Sync Registry
          </Button>
          <CreateFacultyForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Sectors"
          value={faculties.length.toString()}
          description="Integrated Divisions"
          icon={<Building className="w-4 h-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
          trend="+1 Added"
        />
        <SummaryCard
          title="Subdivisions"
          value={totalDepartments.toString()}
          description="Active Departments"
          icon={<Layers className="w-4 h-4 text-purple-500" />}
          color="text-purple-500"
          glow="shadow-purple-500/10"
          trend="8.4 per Sector"
        />
        <SummaryCard
          title="Personnel Lead"
          value={totalLecturers.toString()}
          description="Academic Faculty"
          icon={<Users className="w-4 h-4 text-amber-500" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
          trend="1:22 Density"
        />
        <SummaryCard
          title="Global Ingress"
          value={totalStudents.toString()}
          description="Verified Students"
          icon={<GraduationCap className="w-4 h-4 text-emerald-500" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
          trend="+5.2% Momentum"
        />
      </div>

      {/* Roster Discovery */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Query sector registry (name or identity)..."
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
              Initialize Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Registry Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-primary-100 italic">Sector Registry</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1 italic">Synchronized registry of primary administrative scholastic divisions</CardDescription>
          </div>
          <Badge variant="glass" className="font-bold text-[10px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-4 py-1.5">Verified Units</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="px-8 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Division Identity</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Specification</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Subdivisions</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Lead Density</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Ingress Mass</TableHead>
                  <TableHead className="px-8 py-6 text-right text-xs font-bold text-muted-foreground tracking-tight">Protocol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFaculties.map((faculty) => (
                  <tr key={faculty.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          {faculty.name.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight italic">{faculty.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-[200px] text-xs font-bold text-muted-foreground line-clamp-1 italic opacity-60">
                        {faculty.description || 'Global Strategy'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="glass" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] font-bold px-3">
                        {faculty.departmentCount || 0} Units
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-neon-amber" />
                        <span className="text-xs font-bold tracking-tight">{faculty.lecturerCount || 0} Leads</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-neon-emerald" />
                        <span className="text-xs font-bold tracking-tight">{faculty.studentCount || 0} Nodes</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-primary-100 hover:bg-primary-100/10 rounded-xl transition-all"
                      >
                        <MoreVertical size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        onClick={() => setFacultyToDelete({ id: faculty.id, name: faculty.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFaculties.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-white/5 text-muted-foreground opacity-20">
                <Building size={64} />
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-widest">Registry Scan Result: Zero Sectors Detected</p>
              <Button variant="outline" className="rounded-xl border-white/20" onClick={() => setSearchTerm('')}>Reset Scan Parameters</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-bold text-muted-foreground tracking-tight">
              Registry Meta: <span className="text-primary-100">{paginatedFaculties.length}</span> of {filteredFaculties.length} Records displayed
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

      <AlertDialog open={!!facultyToDelete} onOpenChange={() => setFacultyToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-white/20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl p-10">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mb-6">
            <AlertCircle size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Decoupling Protocol Initiated</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-rose-500 text-sm leading-relaxed mt-2">
              Executing administrative decoupling of <strong>{facultyToDelete?.name}</strong>. This structural termination will purge all associated academic units and staff alignments from the institutional core.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl border-white/20 font-bold text-sm h-11 px-6">Abort Protocol</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFaculty} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm h-11 px-8 border-none shadow-lg shadow-rose-500/20 text-white">Authorize Decoupling</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
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
