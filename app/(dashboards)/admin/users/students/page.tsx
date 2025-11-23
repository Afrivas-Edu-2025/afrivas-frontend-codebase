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
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import CreateStudentForm from '@/components/forms/CreateStudentForm'
import { useGetAllStudentsQuery, useGetStudentDetailsQuery, useDeleteStudentFromUsersMutation } from '@/services/adminApi'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  studentId: string
  program: string
  yearOfStudy: number
  semester: string
  gpa: number
  credits: number
  guardianName: string
  guardianContact: string
  enrollmentDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  enrolledCourses: number
  completedCourses: number
  pendingFees: number
}

interface StudentStats {
  totalCredits: number
  completedCredits: number
  averageGPA: number
  enrolledCourses: number
  completedCourses: number
  attendanceRate: number
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProgram, setFilterProgram] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [programs, setPrograms] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
 
  // Fetch students from backend API
  const { data, error, isLoading } = useGetAllStudentsQuery({ page: currentPage, search: searchTerm, program: filterProgram, year: filterYear, status: filterStatus });

  useEffect(() => {
    console.log('Students API Response:', data);

    if (data) {
      const studentsData: Student[] = Array.isArray(data.data) ? data.data : [];
      setStudents(studentsData);

      const calculatedTotal = data.total ?? studentsData.length ?? 0;
      const derivedTotalPages = data.totalPages ?? Math.max(1, Math.ceil(calculatedTotal / 10));
      setTotalPages(derivedTotalPages);

      if (typeof data.currentPage === 'number') {
        setCurrentPage(data.currentPage);
      }

      const uniquePrograms = studentsData
        .map((student) => student.program)
        .filter((program): program is string => Boolean(program));
      setPrograms([...new Set(uniquePrograms)]);

      const uniqueYears = studentsData
        .map((student) => student.yearOfStudy)
        .filter((year): year is number => typeof year === 'number');
      setYears([...new Set(uniqueYears)].sort((a, b) => a - b));
    }

    if (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }

    setLoading(isLoading);
  }, [data, error, isLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Use the new API services
  const [deleteStudentFromUsers] = useDeleteStudentFromUsersMutation()
  const { data: studentDetails, isLoading: isLoadingDetails } = useGetStudentDetailsQuery(selectedStudent?.id || '', {
    skip: !selectedStudent?.id
  })

  // Handle student deletion
  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudentFromUsers(studentId).unwrap()
      toast.success('Student deleted successfully')
    } catch (error) {
      console.error('Error deleting student:', error)
      toast.error('Failed to delete student')
    }
  }

  // Update student stats when details are loaded
  useEffect(() => {
    if (studentDetails?.data) {
      setStudentStats(studentDetails.data.stats)
    }
  }, [studentDetails])

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleProgramFilter = (value: string) => {
    const actualValue = value === 'all' ? '' : value
    setFilterProgram(actualValue)
    setCurrentPage(1)
  }

  const handleYearFilter = (value: string) => {
    const actualValue = value === 'all' ? '' : value
    setFilterYear(actualValue)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    const actualValue = value === 'all' ? '' : value
    setFilterStatus(actualValue)
    setCurrentPage(1)
  }

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (studentToDelete) {
      handleDeleteStudent(studentToDelete)
    }
    setShowDeleteDialog(false)
    setStudentToDelete(null)
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">Manage student accounts and academic information</p>
        </div>
        <CreateStudentForm onSuccess={() => {}} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 
                ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
                : '0.00'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.pendingFees > 0).length}
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
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterProgram || 'all'} onValueChange={handleProgramFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterYear || 'all'} onValueChange={handleYearFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Year of Study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Manage student accounts and view their academic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {student.pendingFees > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Fees Due
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(student.id)}
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

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Detailed information about the student
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</p>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Phone:</strong> {selectedStudent.phoneNumber}</p>
                    <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                    <p><strong>Date of Birth:</strong> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Address:</strong> {selectedStudent.address}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                    <p><strong>Program:</strong> {selectedStudent.program}</p>
                    <p><strong>Year of Study:</strong> {selectedStudent.yearOfStudy}</p>
                    <p><strong>Semester:</strong> {selectedStudent.semester}</p>
                    <p><strong>GPA:</strong> <span className={getGPAColor(selectedStudent.gpa)}>{selectedStudent.gpa.toFixed(2)}</span></p>
                    <p><strong>Credits:</strong> {selectedStudent.credits}</p>
                    <p><strong>Enrollment Date:</strong> {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Guardian Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Guardian Name:</strong> {selectedStudent.guardianName}</p>
                  <p><strong>Guardian Contact:</strong> {selectedStudent.guardianContact}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Financial Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Pending Fees:</strong> 
                    <span className={selectedStudent.pendingFees > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      ${selectedStudent.pendingFees.toFixed(2)}
                    </span>
                  </p>
                  <p><strong>Status:</strong> {selectedStudent.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              {studentStats && (
                <div>
                  <h4 className="font-semibold mb-2">Academic Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <p><strong>Total Credits:</strong> {studentStats.totalCredits}</p>
                      <p><strong>Completed Credits:</strong> {studentStats.completedCredits}</p>
                      <p><strong>Enrolled Courses:</strong> {studentStats.enrolledCourses}</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>Completed Courses:</strong> {studentStats.completedCourses}</p>
                      <p><strong>Average GPA:</strong> {studentStats.averageGPA.toFixed(2)}</p>
                      <p><strong>Attendance Rate:</strong> {studentStats.attendanceRate}%</p>
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
              This action cannot be undone. This will permanently delete the student account and all associated data.
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

export default StudentsPage
