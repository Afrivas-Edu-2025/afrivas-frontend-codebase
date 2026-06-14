'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Trash2,
  Users,
  UserCheck,
  GraduationCap,
  RefreshCw,
  Sparkles,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  LayoutGrid,
  Mail,
  MoreVertical,
  ChevronRight,
  UserPlus
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  useGetUsersQuery,
  useDeleteLecturerFromUsersMutation,
  useDeleteStudentFromUsersMutation,
} from '@/services/adminApi'
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

type DashboardUser = {
  id: string | number
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  isApproved?: boolean
  createdAt?: string
  student?: unknown
  lecturer?: unknown
}

const ITEMS_PER_PAGE = 20

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'LECTURER'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [userToDelete, setUserToDelete] = useState<DashboardUser | null>(null)

  const { data, isLoading, error, refetch } = useGetUsersQuery({})
  const [deleteStudent] = useDeleteStudentFromUsersMutation()
  const [deleteLecturer] = useDeleteLecturerFromUsersMutation()

  const users = useMemo(() => {
    const rows = (data?.data || []) as DashboardUser[]
    return rows.map((user) => ({
      ...user,
      id: String(user.id),
      role: String(user.role || '').toUpperCase(),
    }))
  }, [data])

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
      const email = (user.email || '').toLowerCase()
      const roleMatches = roleFilter === 'ALL' || user.role === roleFilter
      const searchMatches = !term || fullName.includes(term) || email.includes(term)
      return roleMatches && searchMatches
    })
  }, [users, roleFilter, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const totalStudents = users.filter((user) => user.role === 'STUDENT').length
  const totalLecturers = users.filter((user) => user.role === 'LECTURER').length
  const activeUsers = users.filter((user) => user.isApproved).length

  const handleDelete = async () => {
    if (!userToDelete) return
    try {
      if (userToDelete.role === 'STUDENT') {
        await deleteStudent(String(userToDelete.id)).unwrap()
      } else if (userToDelete.role === 'LECTURER') {
        await deleteLecturer(String(userToDelete.id)).unwrap()
      } else {
        toast.error('Sector-specific accounts only.')
        return
      }
      toast.success('Node purged from institutional matrix')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Purging protocol failure')
    } finally {
      setUserToDelete(null)
    }
  }

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />
      <p className="text-sm font-bold text-muted-foreground animate-pulse">Scanning Neural Registry...</p>
    </div>
  );

  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-[11px] font-bold text-primary-100 tracking-tight mb-1">
            <Users className="w-3.5 h-3.5 mr-2" />
            Population Control
          </div>
          <TextGenerateEffect
            words="User Management"
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent italic tracking-tight"
          />
          <p className="text-muted-foreground font-medium max-w-xl">Supervision and validation of institutional nodes across all scholastic and administrative sectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl font-bold text-sm hover:bg-primary-100/5 transition-all" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Registry
          </Button>
          <Button variant="premium" className="rounded-2xl px-6 h-12 shadow-neon-primary group">
            <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Initialize Node
          </Button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Population"
          value={users.length.toString()}
          description="Integrated Nodes"
          icon={<Users className="w-4 h-4" />}
          color="text-primary-100"
          glow="shadow-primary-100/10"
          trend="+12 Growth"
        />
        <SummaryCard
          title="Scholastic Mass"
          value={totalStudents.toString()}
          description="Verified Students"
          icon={<GraduationCap className="w-4 h-4 text-purple-500" />}
          color="text-purple-500"
          glow="shadow-purple-500/10"
          trend="84.2% Density"
        />
        <SummaryCard
          title="Faculty Leads"
          value={totalLecturers.toString()}
          description="Academic Staff"
          icon={<UserCheck className="w-4 h-4 text-amber-500" />}
          color="text-amber-500"
          glow="shadow-amber-500/10"
          trend="1:15 Ratio"
        />
        <SummaryCard
          title="Verified Status"
          value={activeUsers.toString()}
          description="Approved Nodes"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
          color="text-emerald-500"
          glow="shadow-emerald-500/10"
          trend="Secure High"
        />
      </div>

      {/* Filtration Discovery */}
      <Card className="border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Query neural registry (name or email)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 dark:border-slate-700/50 rounded-2xl focus:ring-primary-100 text-sm font-bold"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={roleFilter}
                onValueChange={(value: 'ALL' | 'STUDENT' | 'LECTURER') => {
                  setRoleFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[200px] h-12 bg-white/50 dark:bg-slate-800/50 border-white/10 rounded-2xl text-xs font-bold tracking-tight focus:ring-primary-100">
                  <SelectValue placeholder="Sector Selection" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 rounded-2xl">
                  <SelectItem value="ALL" className="text-xs font-bold p-3">Global Spectrum</SelectItem>
                  <SelectItem value="STUDENT" className="text-xs font-bold p-3">Scholastic Sector</SelectItem>
                  <SelectItem value="LECTURER" className="text-xs font-bold p-3">Faculty Sector</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-2xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/10 font-bold text-sm h-12 px-8">
                Initialize Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Registry Table */}
      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-primary-100 italic">Population Registry</CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1 italic">Atmospheric log of verified institutional identities</CardDescription>
          </div>
          <Badge variant="glass" className="font-bold text-[10px] bg-primary-100/10 text-primary-100 border-primary-100/20 px-4 py-1.5">Live Database</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5">
                  <TableHead className="px-8 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Node Identity</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Scholastic Contact</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Structural Sector</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Activation</TableHead>
                  <TableHead className="px-6 py-6 text-left text-xs font-bold text-muted-foreground tracking-tight">Ingress</TableHead>
                  <TableHead className="px-8 py-6 text-right text-xs font-bold text-muted-foreground tracking-tight">Protocol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <tr key={String(user.id)} className="border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-lg group-hover:scale-110 transition-transform overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent" />
                          {user.firstName?.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors leading-tight italic">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-primary-100 opacity-40" />
                        <span className="text-xs font-bold text-muted-foreground lowercase tracking-tight opacity-70">{user.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="glass"
                        className={cn(
                          "px-3 py-1 font-bold text-[10px] tracking-tight",
                          user.role === 'STUDENT' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-neon-indigo' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-neon-amber'
                        )}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="glass"
                        className={cn(
                          "px-3 py-1 font-bold text-[10px] tracking-tight",
                          user.isApproved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-neon-emerald' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        )}
                      >
                        {user.isApproved ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-muted-foreground opacity-40 italic">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-white/5 text-muted-foreground opacity-20">
                <Users size={64} />
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-widest">Registry Scan Result: Zero Nodes Identified</p>
              <Button variant="outline" className="rounded-xl border-white/20" onClick={() => { setSearchTerm(''); setRoleFilter('ALL'); }}>Reset Exploration Parameters</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-xs font-bold text-muted-foreground tracking-tight">
              Registry Meta: <span className="text-primary-100">{paginatedUsers.length}</span> of {filteredUsers.length} Nodes displayed
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

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-white/20 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl p-10">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mb-6">
            <Activity size={32} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Node Purging Protocol</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-rose-500 text-sm leading-relaxed mt-2">
              Executing permanent structural purge of <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong> ({userToDelete?.role}). This structural termination will decouple the node from all institutional neural links.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-2xl border-white/20 font-bold text-sm h-11 px-6">Cancel Protocol</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm h-11 px-8 border-none shadow-lg shadow-rose-500/20 text-white">Authorize Purge</AlertDialogAction>
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
