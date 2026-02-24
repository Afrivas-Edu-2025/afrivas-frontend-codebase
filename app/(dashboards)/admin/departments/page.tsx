'use client'

import { useEffect, useMemo, useState } from 'react'
import { Building2, RefreshCw, Search, Trash2, University } from 'lucide-react'
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
    return departments.filter((department) =>
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

  const linkedFaculties = new Set(departments.map((department) => department.faculty?.name).filter(Boolean)).size
  const unassignedDepartments = departments.filter((department) => !department.faculty?.name).length

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return
    try {
      await deleteDepartment(departmentToDelete.id).unwrap()
      toast.success('Department deleted successfully')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Failed to delete department')
    } finally {
      setDepartmentToDelete(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-widest mb-1">
            Academic Infrastructure
          </div>
          <TextGenerateEffect
            words="Department Management"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium">Configure institutional subdivisions and faculty alignments</p>
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
          <CreateDepartmentForm onSuccess={() => refetch()} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Departments", value: departments.length, icon: Building2, color: "from-blue-500 to-cyan-500" },
          { label: "Linked Faculties", value: linkedFaculties, icon: University, color: "from-purple-500 to-indigo-500" },
          { label: "Unassigned Units", value: unassignedDepartments, icon: Building2, color: "from-amber-500 to-orange-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Search className="h-4 w-4 text-primary-100" />
            Unit Discovery
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-wider">Search across subdivisions and physical faculties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
            <Input
              placeholder="Search departments by name or faculty affiliation..."
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
              <CardTitle className="text-xl font-bold">Institutional Units</CardTitle>
              <CardDescription className="font-medium">Registration log of all academic departments</CardDescription>
            </div>
            <div className="text-xs font-extrabold text-primary-100 uppercase tracking-widest px-3 py-1 bg-primary-100/10 rounded-full border border-primary-100/20">
              {filteredDepartments.length} Departments Found
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100/20 border-t-primary-100 rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary-100 uppercase tracking-widest">Querying registry...</p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No subdivisions identified.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Faculty Alignment</TableHead>
                    <TableHead>Record Created</TableHead>
                    <TableHead className="text-right">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDepartments.map((department) => (
                    <TableRow key={department.id} className="group transition-all duration-300">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100/20 to-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {department.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors uppercase tracking-tight">{department.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={department.faculty?.name ? 'glass' : 'outline'} className={cn(
                          !department.faculty?.name && "border-amber-500/20 text-amber-500 bg-amber-500/5"
                        )}>
                          {department.faculty?.name || 'Unassigned'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                        {new Date(department.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          onClick={() => setDepartmentToDelete({ id: department.id, name: department.name })}
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

          {filteredDepartments.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Displaying <span className="text-primary-100">{paginatedDepartments.length}</span> of {filteredDepartments.length} Units
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

      <AlertDialog open={!!departmentToDelete} onOpenChange={() => setDepartmentToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Structural Deletion Protocol</AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-red-500">
              You are about to permanently purge <strong>{departmentToDelete?.name}</strong> from the institutional hierarchy. All associated academic records and student alignments may be destabilized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-white/20">Abort Operation</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold border-none shadow-lg shadow-red-500/20">Authorize Removal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
