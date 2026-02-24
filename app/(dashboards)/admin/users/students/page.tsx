'use client'

import { useState, useEffect, useMemo } from 'react'
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
  userId?: string
  firstName: string
  lastName: string
  email: string
  role: string
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

import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

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
  const [programs, setPrograms] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])

  // Fetch students from backend API
  const { data, error, isLoading, refetch } = useGetAllStudentsQuery({ limit: 200 });

  useEffect(() => {
    console.log('Students API Response:', data);

    if (data) {
      const studentsData: Student[] = Array.isArray(data.data) ? data.data : [];
      setStudents(studentsData);

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

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch =
        !term ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) ||
        (student.email || '').toLowerCase().includes(term) ||
        (student.studentId || '').toLowerCase().includes(term)
      const matchesProgram =
        !filterProgram || (student.program || '').toLowerCase() === filterProgram.toLowerCase()
      const matchesYear =
        !filterYear || String(student.yearOfStudy || '') === filterYear
      const matchesStatus =
        !filterStatus ||
        (filterStatus === 'active' ? Boolean(student.isActive) : !student.isActive)

      return matchesSearch && matchesProgram && matchesYear && matchesStatus
    })
  }, [students, searchTerm, filterProgram, filterYear, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / 20))
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * 20
    return filteredStudents.slice(start, start + 20)
  }, [filteredStudents, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
      refetch()
    } catch (error: any) {
      const backendMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        'Failed to delete student'
      console.error('Error deleting student:', { studentId, error, backendMessage })
      toast.error(backendMessage)
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

  const handleDeleteClick = (student: Student) => {
    if (!student.userId) {
      toast.error('Unable to delete student: linked user id is missing')
      return
    }
    setStudentToDelete(student.userId)
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
    if (gpa >= 3.5) return 'text-emerald-500'
    if (gpa >= 3.0) return 'text-blue-500'
    if (gpa >= 2.5) return 'text-amber-500'
    return 'text-red-500'
  }


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-widest mb-1">
            Administration
          </div>
          <TextGenerateEffect
            words="Students Management"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium">Manage student accounts and academic information</p>
        </div>
        <CreateStudentForm onSuccess={() => refetch()} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: students.length, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Active", value: students.filter(s => s.isActive).length, icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
          { label: "Programs", value: programs.length, icon: BookOpen, color: "from-purple-500 to-pink-500" },
          { label: "Avg GPA", value: students.length > 0 ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2) : '0.00', icon: TrendingUp, color: "from-amber-500 to-orange-500" },
          { label: "Fees Due", value: students.filter(s => s.pendingFees > 0).length, icon: Calendar, color: "from-red-500 to-rose-500" },
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

      {/* Filters */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-100" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100"
                />
              </div>
            </div>
            <Select value={filterProgram || 'all'} onValueChange={handleProgramFilter}>
              <SelectTrigger className="w-[180px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterYear || 'all'} onValueChange={handleYearFilter}>
              <SelectTrigger className="w-[160px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl border-white/20 dark:border-slate-700/50 hover:bg-primary-100/5">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="border-b border-white/10 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Students List</CardTitle>
              <CardDescription className="font-medium">
                Showing {paginatedStudents.length} of {filteredStudents.length} student accounts
              </CardDescription>
            </div>
            <div className="text-xs font-bold text-primary-100 uppercase tracking-widest px-3 py-1 bg-primary-100/10 rounded-full border border-primary-100/20">
              Page {currentPage}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100/20 border-t-primary-100 rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary-100 uppercase tracking-widest">Fetching student data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Program/Dept</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.id} className="group transition-all duration-300">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100/20 to-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-sm">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <div className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">{student.email}</TableCell>
                      <TableCell>
                        <div className="text-xs font-bold px-2.5 py-1 bg-blue-100/10 text-blue-500 border border-blue-500/20 rounded-lg inline-block uppercase tracking-wider">
                          {student.program || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold px-2.5 py-1 bg-purple-100/10 text-purple-500 border border-purple-500/20 rounded-lg inline-block uppercase tracking-wider">
                          Year {student.yearOfStudy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <Badge variant="glass">
                            {student.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {student.pendingFees > 0 && (
                            <Badge variant="destructive" className="text-[10px] font-bold px-2 h-5">
                              Fees Outstanding
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={() => setSelectedStudent(student)}
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
                            onClick={() => handleDeleteClick(student)}
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
          {filteredStudents.length > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Page <span className="text-primary-100">{currentPage}</span> / {totalPages}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/20 bg-white/50 dark:bg-slate-800/50"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="premium"
                  size="sm"
                  className="rounded-xl px-4"
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

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-white/20 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader className="p-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Student Information Profile</DialogTitle>
            <DialogDescription className="font-medium">
              Comprehensive profile and academic overview
            </DialogDescription>
          </DialogHeader>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
          {selectedStudent && (
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary-100 rounded-full" />
                    Personal Details
                  </h4>
                  <div className="space-y-4 bg-primary-100/5 p-5 rounded-2xl border border-primary-100/10">
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</span>
                      <span className="text-sm font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                      <span className="text-sm font-bold">{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</span>
                      <span className="text-sm font-bold">{selectedStudent.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</span>
                      <span className="text-sm font-bold">{selectedStudent.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">DOB</span>
                      <span className="text-sm font-bold">{selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary-100 rounded-full" />
                    Academic Standing
                  </h4>
                  <div className="space-y-4 bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/20 dark:border-slate-700/50">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Student ID</span>
                      <span className="text-sm font-bold text-primary-100">{selectedStudent.studentId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Program</span>
                      <span className="text-sm font-bold">{selectedStudent.program}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Year/Sem</span>
                      <span className="text-sm font-bold">Year {selectedStudent.yearOfStudy}, {selectedStudent.semester}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">GPA</span>
                      <span className={cn("text-lg font-black", getGPAColor(selectedStudent.gpa))}>{selectedStudent.gpa.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Credits</span>
                      <span className="text-sm font-bold">{selectedStudent.credits} CR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary-100 rounded-full" />
                    Emergency Contact
                  </h4>
                  <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                    <p className="text-sm font-bold">{selectedStudent.guardianName}</p>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <span className="h-1 w-1 bg-amber-500 rounded-full" />
                      {selectedStudent.guardianContact}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary-100 rounded-full" />
                    Financial Status
                  </h4>
                  <div className={cn(
                    "p-5 rounded-2xl border flex items-center justify-between",
                    selectedStudent.pendingFees > 0 ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"
                  )}>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Balance Due</p>
                      <p className={cn("text-2xl font-black", selectedStudent.pendingFees > 0 ? "text-red-500" : "text-emerald-500")}>
                        ${selectedStudent.pendingFees.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant={selectedStudent.pendingFees > 0 ? "destructive" : "glass"}>
                      {selectedStudent.pendingFees > 0 ? "Urgent Review" : "Settled"}
                    </Badge>
                  </div>
                </div>
              </div>

              {studentStats && (
                <div className="space-y-4 bg-gradient-to-br from-primary-100/10 to-transparent p-6 rounded-3xl border border-primary-100/10">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em]">Academic Statistics (Real-time Analytics)</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completion</p>
                      <p className="text-lg font-black">{(studentStats.completedCourses / studentStats.enrolledCourses * 100).toFixed(0)}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attendance</p>
                      <p className="text-lg font-black text-emerald-500">{studentStats.attendanceRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Credits Earned</p>
                      <p className="text-lg font-black text-blue-500">{studentStats.completedCredits}/{studentStats.totalCredits}</p>
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
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Security Verification</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-red-500">
              Are you absoluteley sure? This action will permanently remove all student records and data associated with this account. This cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-white/20">Abort Operation</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold border-none shadow-lg shadow-red-500/20">Confirm Deletion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StudentsPage
