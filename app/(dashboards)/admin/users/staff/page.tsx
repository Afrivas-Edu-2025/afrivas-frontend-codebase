'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Briefcase,
  Building,
  Users,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  employeeId: string
  position: string
  department: string
  salary: number
  hireDate: string
  supervisor: string
  employmentStatus: string
  emergencyContact: string
  emergencyPhone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  yearsOfService: number
  lastPromotionDate: string
  performanceRating: number
}

interface StaffStats {
  totalEmployees: number
  activeEmployees: number
  departmentCount: number
  avgSalary: number
  avgYearsOfService: number
  avgPerformanceRating: number
}

import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterPosition, setFilterPosition] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [staffStats, setStaffStats] = useState<StaffStats | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [departments, setDepartments] = useState<string[]>([])
  const [positions, setPositions] = useState<string[]>([])

  // Fetch staff from backend API
  const fetchStaff = async (page = 1, search = '', department = '', position = '', status = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(department && { department }),
        ...(position && { position }),
        ...(status && { status })
      })

      const response = await fetch(`/api/admin/users/staff?${params}`)
      if (!response.ok) throw new Error('Failed to fetch staff')

      const data = await response.json()
      setStaff(data.staff || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || 1)

      // Extract unique departments and positions for filters
      const uniqueDepartments = [...new Set(data.staff?.map((s: Staff) => s.department) || [])]
      const uniquePositions = [...new Set(data.staff?.map((s: Staff) => s.position) || [])]
      setDepartments(uniqueDepartments)
      setPositions(uniquePositions)
    } catch (error) {
      console.error('Error fetching staff:', error)
      toast.error('Failed to fetch staff')
    } finally {
      setLoading(false)
    }
  }

  // Fetch staff details with stats
  const fetchStaffDetails = async (staffId: string) => {
    try {
      const response = await fetch(`/api/admin/users/staff/${staffId}`)
      if (!response.ok) throw new Error('Failed to fetch staff details')

      const data = await response.json()
      setSelectedStaff(data.staff)
      setStaffStats(data.stats)
    } catch (error) {
      console.error('Error fetching staff details:', error)
      toast.error('Failed to fetch staff details')
    }
  }

  // Delete staff member
  const deleteStaff = async (staffId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${staffId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete staff member')

      toast.success('Staff member deleted successfully')
      fetchStaff(currentPage, searchTerm, filterDepartment, filterPosition, filterStatus)
    } catch (error) {
      console.error('Error deleting staff member:', error)
      toast.error('Failed to delete staff member')
    }
  }

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchStaff(1, value, filterDepartment, filterPosition, filterStatus)
  }

  const handleDepartmentFilter = (value: string) => {
    setFilterDepartment(value)
    setCurrentPage(1)
    fetchStaff(1, searchTerm, value, filterPosition, filterStatus)
  }

  const handlePositionFilter = (value: string) => {
    setFilterPosition(value)
    setCurrentPage(1)
    fetchStaff(1, searchTerm, filterDepartment, value, filterStatus)
  }

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value)
    setCurrentPage(1)
    fetchStaff(1, searchTerm, filterDepartment, filterPosition, value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchStaff(page, searchTerm, filterDepartment, filterPosition, filterStatus)
  }

  const handleDeleteClick = (staffId: string) => {
    setStaffToDelete(staffId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete)
    }
    setShowDeleteDialog(false)
    setStaffToDelete(null)
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-500'
    if (rating >= 4.0) return 'text-blue-500'
    if (rating >= 3.5) return 'text-amber-500'
    return 'text-red-500'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'glass'
      case 'on leave':
        return 'secondary'
      case 'terminated':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-widest mb-1">
            Personnel Management
          </div>
          <TextGenerateEffect
            words="Administrative Staff"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium">Manage institutional staff and employment records</p>
        </div>
        <Button variant="premium" className="rounded-xl shadow-neon-primary">
          <UserPlus className="mr-2 h-4 w-4" />
          Register New Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Staff", value: staff.length, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Active", value: staff.filter(s => s.isActive).length, icon: Briefcase, color: "from-emerald-500 to-teal-500" },
          { label: "Departments", value: departments.length, icon: Building, color: "from-purple-500 to-pink-500" },
          { label: "Avg Salary", value: staff.length > 0 ? formatSalary(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length) : '$0', icon: TrendingUp, color: "from-amber-500 to-orange-500" },
          { label: "Avg Tenure", value: staff.length > 0 ? (staff.reduce((sum, s) => sum + s.yearsOfService, 0) / staff.length).toFixed(1) + 'y' : '0y', icon: Clock, color: "from-indigo-500 to-blue-500" },
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

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-100" />
            Search & Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Filter by name, ID or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100 transition-all"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={handleDepartmentFilter}>
              <SelectTrigger className="w-[180px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={handlePositionFilter}>
              <SelectTrigger className="w-[180px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="">All Positions</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/5">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="border-b border-white/10 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Personnel Roster</CardTitle>
              <CardDescription className="font-medium">
                Detailed staff records and efficiency profiles
              </CardDescription>
            </div>
            <div className="text-xs font-bold text-primary-100 uppercase tracking-widest px-3 py-1 bg-primary-100/10 rounded-full border border-primary-100/20">
              {staff.length} Active Records
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100/20 border-t-primary-100 rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary-100 uppercase tracking-widest">Compiling roster...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Identity</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Remuneration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id} className="group transition-all duration-300">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100/20 to-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-primary-100">{member.employeeId}</TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        <div className="text-xs font-bold px-2 py-0.5 bg-blue-100/10 text-blue-500 border border-blue-500/20 rounded-lg inline-block uppercase tracking-wider">
                          {member.department}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-600 dark:text-gray-400">{member.position}</TableCell>
                      <TableCell className="font-bold">{formatSalary(member.salary)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getStatusColor(member.employmentStatus)}>
                            {member.employmentStatus}
                          </Badge>
                          {member.performanceRating > 0 && (
                            <div className={`text-[10px] font-black uppercase tracking-[0.15em] ${getPerformanceColor(member.performanceRating)} flex items-center gap-1`}>
                              <TrendingUp className="h-3 w-3" />
                              PR: {member.performanceRating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary-100/10 hover:text-primary-100"
                            onClick={() => fetchStaffDetails(member.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 text-red-400"
                            onClick={() => handleDeleteClick(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-6 border-t border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Page <span className="text-primary-100">{currentPage}</span> of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/20 bg-white/50 dark:bg-slate-800/50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="premium"
                  size="sm"
                  className="rounded-xl px-4"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Details Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-white/20 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader className="p-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Institutional Staff Profile</DialogTitle>
            <DialogDescription className="font-medium">
              Comprehensive personnel information and efficiency analytics
            </DialogDescription>
          </DialogHeader>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
          {selectedStaff && (
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Personal Data
                  </h4>
                  <div className="space-y-4 bg-primary-100/5 p-5 rounded-2xl border border-primary-100/10">
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identity</span>
                      <span className="text-sm font-bold">{selectedStaff.firstName} {selectedStaff.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Communication</span>
                      <span className="text-sm font-bold">{selectedStaff.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</span>
                      <span className="text-sm font-bold">{selectedStaff.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Birth Date</span>
                      <span className="text-sm font-bold">{new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</span>
                      <span className="text-sm font-bold line-clamp-1">{selectedStaff.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Employment Contract
                  </h4>
                  <div className="space-y-4 bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/20 dark:border-slate-700/50">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ID Record</span>
                      <span className="text-sm font-bold text-primary-100 font-mono tracking-tighter">{selectedStaff.employeeId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Placement</span>
                      <span className="text-sm font-bold">{selectedStaff.department || 'General Administration'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Designation</span>
                      <span className="text-sm font-bold">{selectedStaff.position}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Remuneration</span>
                      <span className="text-sm font-bold text-emerald-500">{formatSalary(selectedStaff.salary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Onboarding</span>
                      <span className="text-sm font-bold">{new Date(selectedStaff.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Safety & Crisis
                  </h4>
                  <div className="space-y-4 bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
                    <div className="flex justify-between border-b border-orange-500/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Person</span>
                      <span className="text-sm font-bold">{selectedStaff.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Emergency Phone</span>
                      <span className="text-sm font-bold text-orange-500">{selectedStaff.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Efficiency KPI
                  </h4>
                  <div className="space-y-4 bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10">
                    <div className="flex justify-between border-b border-blue-500/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance Index</span>
                      <span className={`text-sm font-black ${getPerformanceColor(selectedStaff.performanceRating)}`}>
                        {selectedStaff.performanceRating > 0 ? selectedStaff.performanceRating.toFixed(1) + ' / 5.0' : 'AWAITING RATING'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Promotion Log</span>
                      <span className="text-sm font-bold">
                        {selectedStaff.lastPromotionDate ? new Date(selectedStaff.lastPromotionDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {staffStats && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] text-center">Institutional Department Context</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Scale</p>
                      <p className="text-xl font-black">{staffStats.totalEmployees} <span className="text-[10px] text-muted-foreground font-medium">Headcount</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100/10 to-transparent border border-emerald-500/20 shadow-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fiscal Impact</p>
                      <p className="text-xl font-black text-emerald-500">{formatSalary(staffStats.avgSalary)} <span className="text-[10px] text-muted-foreground font-medium">Avg</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100/10 to-transparent border border-blue-500/20 shadow-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Loyalty Index</p>
                      <p className="text-xl font-black text-blue-500">{staffStats.avgYearsOfService.toFixed(1)} <span className="text-[10px] text-muted-foreground font-medium">Years</span></p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100/10 to-transparent border border-purple-500/20 shadow-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Excellence</p>
                      <p className="text-xl font-black text-purple-500">{staffStats.avgPerformanceRating.toFixed(1)} <span className="text-[10px] text-muted-foreground font-medium">Rating</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Security Authorization Required</AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-red-500">
              Permanently terminate this employment record? All associated data, financial logs, and access credentials will be purged from the central database. This action is final.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-white/20">Cancel Operation</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold border-none shadow-lg shadow-red-500/20">Authorize Removal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StaffPage
