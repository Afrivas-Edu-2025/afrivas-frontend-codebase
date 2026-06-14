'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  RefreshCw,
  Search,
  Trash2,
  University,
  Sparkles,
  Layers,
  Activity,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Zap,
  Target,
  Box,
  Binary
} from 'lucide-react'
import { toast } from 'sonner'
import CreateDepartmentForm from '@/components/forms/CreateDepartmentForm'
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from '@/services/adminApi'
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

export default function DepartmentsPage() {
  const ITEMS_PER_PAGE = 20
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [departmentToDelete, setDepartmentToDelete] = useState<{ id: string; name: string } | null>(null)
  const { data: departmentsData, isLoading, error, refetch } = useGetDepartmentsQuery()
  const [deleteDepartment] = useDeleteDepartmentMutation()

  const departments = departmentsData?.data || []
  const filteredDepartments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return departments
    return departments.filter((department: any) =>
      department.name.toLowerCase().includes(term) ||
      (department.faculty?.name || '').toLowerCase().includes(term),
    )
  }, [departments, searchTerm])
  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE))
  const paginatedDepartments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDepartments.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredDepartments, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const linkedFaculties = new Set(departments.map((department: any) => department.faculty?.name).filter(Boolean)).size
  const unassignedDepartments = departments.filter((department: any) => !department.faculty?.name).length

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return
    try {
      await deleteDepartment(departmentToDelete.id).unwrap()
      toast.success('Department unit purged from registry')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Purging protocol failed')
    } finally {
      setDepartmentToDelete(null)
    }
  }

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Querying Unit Registry...</p>
    </div>
  );

  return (
    <div className="space-y-10 p-2 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-tight mb-1">
            <Building2 className="w-3.5 h-3.5 mr-2" />
            Unit Infrastructure
          </div>
          <TextGenerateEffect
            words="Department Registry"
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic tracking-tight"
          />
          <p className="text-muted-foreground font-medium max-w-xl">Granular configuration of institutional subdivisions and faculty-sector alignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl h-12 px-6 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold text-sm hover:bg-primary-100/5 transition-all"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh Registry
          </Button>
          <CreateDepartmentForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard
          title="Total Units"
          value={departments.length.toString()}
          description="Registered Departments"
          icon={<Box className="w-4 h-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
          trend="+3 Chronological"
        />
        <SummaryCard
          title="Faculty Links"
          value={linkedFaculties.toString()}
          description="Verified Alignments"
          icon={<University className="w-4 h-4 text-purple-500" />}
          color="text-purple-500"
          glow="shadow-purple-500/10"
          trend="82% Integration"
        />
        <SummaryCard
          title="Floating Units"
          value={unassignedDepartments.toString()}
          description="Awaiting Sectoring"
          icon={<Zap className="w-4 h-4 text-amber-500" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
          trend="Action Required"
        />
      </div>

      {/* Unit Discovery Discovery */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Query unit registry (name or affiliation)..."
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
              Advanced Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-primary-100 italic">Institutional Units</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1 italic">Real-time registration log of all recognized academic departments</CardDescription>
          </div>
          <Badge variant="glass" className="font-bold text-[10px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-4 py-1.5">Active Nodes</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="px-8 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Department Identity</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Faculty Sector</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Synchronization</TableHead>
                  <TableHead className="px-8 py-6 text-right text-xs font-bold text-muted-foreground tracking-tight">Execution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDepartments.map((department: any) => (
                  <tr key={department.id} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                          <Binary size={18} />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight italic">{department.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant={department.faculty?.name ? 'glass' : 'outline'}
                        className={cn(
                          "px-3 py-1 font-bold text-[10px] tracking-tight",
                          department.faculty?.name
                            ? 'bg-primary-100/10 text-primary-100 border-primary-100/20'
                            : "border-amber-500/20 text-amber-500 bg-amber-500/5"
                        )}
                      >
                        {department.faculty?.name || 'Unassigned Node'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground opacity-60">Verified Link</span>
                        <span className="text-[10px] font-medium text-muted-foreground opacity-40 italic">
                          {new Date(department.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
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
                        onClick={() => setDepartmentToDelete({ id: department.id, name: department.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDepartments.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-white/5 text-muted-foreground opacity-20">
                <Binary size={64} />
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-widest">Registry Scan Result: Zero Units Detected</p>
              <Button variant="outline" className="rounded-xl border-white/20" onClick={() => setSearchTerm('')}>Reset Scan Parameters</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-bold text-muted-foreground tracking-tight">
              Registry Meta: <span className="text-primary-100">{paginatedDepartments.length}</span> of {filteredDepartments.length} Units displayed
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl font-bold text-xs hover:bg-primary-100/10 px-4 h-9"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
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

      <AlertDialog open={!!departmentToDelete} onOpenChange={() => setDepartmentToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-white/20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl p-10">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mb-6">
            <Activity size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">De-registration Protocol</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-rose-500 text-sm leading-relaxed mt-2">
              Executing structural purge of <strong>{departmentToDelete?.name}</strong>. This action will permanently decouple the unit from the institutional registry and impact all associated academic nodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl border-white/20 font-bold text-sm h-11 px-6">Cancel Purge</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm h-11 px-8 border-none shadow-lg shadow-rose-500/20 text-white">Authorize Purge</AlertDialogAction>
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
