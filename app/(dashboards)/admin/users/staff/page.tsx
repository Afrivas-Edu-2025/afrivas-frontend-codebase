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
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff accounts and employment information</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.length > 0 
                ? formatSalary(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length)
                : '$0'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Years</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.length > 0 
                ? (staff.reduce((sum, s) => sum + s.yearsOfService, 0) / staff.length).toFixed(1)
                : '0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={handleDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={handlePositionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Positions</SelectItem>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>
            Manage staff accounts and view their employment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Years of Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.employeeId}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{formatSalary(member.salary)}</TableCell>
                    <TableCell>{member.yearsOfService} years</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={getStatusColor(member.employmentStatus)}>
                          {member.employmentStatus}
                        </Badge>
                        {member.performanceRating > 0 && (
                          <div className={`text-xs font-medium ${getPerformanceColor(member.performanceRating)}`}>
                            ★ {member.performanceRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchStaffDetails(member.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Staff Details</DialogTitle>
            <DialogDescription>
              Detailed information about the staff member
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedStaff.firstName} {selectedStaff.lastName}</p>
                    <p><strong>Email:</strong> {selectedStaff.email}</p>
                    <p><strong>Phone:</strong> {selectedStaff.phoneNumber}</p>
                    <p><strong>Gender:</strong> {selectedStaff.gender}</p>
                    <p><strong>Date of Birth:</strong> {new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {selectedStaff.address}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Employment Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Employee ID:</strong> {selectedStaff.employeeId}</p>
                    <p><strong>Department:</strong> {selectedStaff.department}</p>
                    <p><strong>Position:</strong> {selectedStaff.position}</p>
                    <p><strong>Salary:</strong> {formatSalary(selectedStaff.salary)}</p>
                    <p><strong>Hire Date:</strong> {new Date(selectedStaff.hireDate).toLocaleDateString()}</p>
                    <p><strong>Years of Service:</strong> {selectedStaff.yearsOfService} years</p>
                    <p><strong>Employment Status:</strong> {selectedStaff.employmentStatus}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Emergency Contact</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Contact Name:</strong> {selectedStaff.emergencyContact}</p>
                    <p><strong>Contact Phone:</strong> {selectedStaff.emergencyPhone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Performance Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Performance Rating:</strong> 
                      <span className={`font-medium ${getPerformanceColor(selectedStaff.performanceRating)}`}>
                        {selectedStaff.performanceRating > 0 ? selectedStaff.performanceRating.toFixed(1) : 'N/A'}
                      </span>
                    </p>
                    <p><strong>Last Promotion:</strong> 
                      {selectedStaff.lastPromotionDate 
                        ? new Date(selectedStaff.lastPromotionDate).toLocaleDateString() 
                        : 'N/A'
                      }
                    </p>
                    <p><strong>Supervisor:</strong> {selectedStaff.supervisor || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {staffStats && (
                <div>
                  <h4 className="font-semibold mb-2">Department Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm">
                      <p><strong>Total Employees:</strong> {staffStats.totalEmployees}</p>
                      <p><strong>Active Employees:</strong> {staffStats.activeEmployees}</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>Average Salary:</strong> {formatSalary(staffStats.avgSalary)}</p>
                      <p><strong>Average Years:</strong> {staffStats.avgYearsOfService.toFixed(1)}</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>Average Performance:</strong> {staffStats.avgPerformanceRating.toFixed(1)}</p>
                      <p><strong>Department Count:</strong> {staffStats.departmentCount}</p>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StaffPage
