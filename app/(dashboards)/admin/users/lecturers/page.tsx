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
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import CreateLecturerForm from '@/components/forms/CreateLecturerForm'
import { useGetAllLecturersQuery, useGetLecturerDetailsQuery, useDeleteLecturerFromUsersMutation } from '@/services/adminApi'

interface Lecturer {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  employeeId: string;
  department: string;
  position: string;
  qualifications: string[];
  specialization: string[];
  officeLocation: string;
  officeHours: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedCourses: number;
  totalStudents: number;
  averageRating: number;
}

interface LecturerStats {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  yearsOfExperience: number;
}

import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

const LecturersPage = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [lecturerStats, setLecturerStats] = useState<LecturerStats | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);

  // Fetch lecturers using adminApi service
  const { data, error, isLoading, refetch } = useGetAllLecturersQuery({ limit: 200 });

  useEffect(() => {
    if (data) {
      const lecturersData = data.data || [];
      setLecturers(lecturersData);

      // Extract unique departments for filter from fetched data
      const uniqueDepartments = [...new Set(lecturersData.map((l: Lecturer) => l.department).filter(Boolean))] as string[];
      setDepartments(uniqueDepartments);
    }
    if (error) {
      console.error('Error fetching lecturers:', error);
      toast.error('Failed to fetch lecturers');
    }
    setLoading(isLoading);
  }, [data, error, isLoading]);

  const filteredLecturers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        !term ||
        `${lecturer.firstName} ${lecturer.lastName}`.toLowerCase().includes(term) ||
        (lecturer.email || '').toLowerCase().includes(term) ||
        (lecturer.employeeId || '').toLowerCase().includes(term);
      const matchesDepartment =
        !filterDepartment || (lecturer.department || '').toLowerCase() === filterDepartment.toLowerCase();
      const matchesStatus =
        !filterStatus || (filterStatus === 'active' ? Boolean(lecturer.isActive) : !lecturer.isActive);
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [lecturers, searchTerm, filterDepartment, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredLecturers.length / 20));
  const paginatedLecturers = useMemo(() => {
    const start = (currentPage - 1) * 20;
    return filteredLecturers.slice(start, start + 20);
  }, [filteredLecturers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Use the new API services
  const [deleteLecturerFromUsers] = useDeleteLecturerFromUsersMutation()
  const { data: lecturerDetails, isLoading: isLoadingDetails } = useGetLecturerDetailsQuery(selectedLecturer?.id || '', {
    skip: !selectedLecturer?.id
  })

  // Handle lecturer deletion
  const handleDeleteLecturer = async (lecturerId: string) => {
    try {
      await deleteLecturerFromUsers(lecturerId).unwrap()
      toast.success('Lecturer deleted successfully')
      refetch()
    } catch (error: any) {
      const backendMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        'Failed to delete lecturer'
      console.error('Error deleting lecturer:', { lecturerId, error, backendMessage })
      toast.error(backendMessage)
    }
  }

  // Update lecturer stats when details are loaded
  useEffect(() => {
    if (lecturerDetails?.data) {
      setLecturerStats(lecturerDetails.data.stats)
    }
  }, [lecturerDetails])

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    setFilterDepartment(actualValue);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    setFilterStatus(actualValue);
    setCurrentPage(1);
  };

  const handleDeleteClick = (lecturer: Lecturer) => {
    if (!lecturer.userId) {
      toast.error('Unable to delete lecturer: linked user id is missing')
      return
    }
    setLecturerToDelete(lecturer.userId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (lecturerToDelete) {
      handleDeleteLecturer(lecturerToDelete);
    }
    setShowDeleteDialog(false);
    setLecturerToDelete(null);
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/10 dark:bg-primary-100/5 backdrop-blur-md border border-primary-100/20 text-xs font-bold text-primary-100 uppercase tracking-widest mb-1">
            Faculty Administration
          </div>
          <TextGenerateEffect
            words="Lecturers Management"
            className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium">Manage lecturer accounts and information profiles</p>
        </div>
        <CreateLecturerForm onSuccess={() => refetch()} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Lecturers", value: lecturers.length, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Active", value: lecturers.filter(l => l.isActive).length, icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
          { label: "Departments", value: departments.length, icon: BookOpen, color: "from-purple-500 to-pink-500" },
          { label: "Avg Rating", value: lecturers.length > 0 ? (lecturers.reduce((sum, l) => sum + l.averageRating, 0) / lecturers.length).toFixed(1) : '0.0', icon: TrendingUp, color: "from-amber-500 to-orange-500" },
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
            Selection Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
                <Input
                  placeholder="Search lecturers by name or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 rounded-xl focus:ring-primary-100 transition-all"
                />
              </div>
            </div>
            <Select value={filterDepartment || 'all'} onValueChange={handleDepartmentFilter}>
              <SelectTrigger className="w-[200px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[160px] rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
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

      {/* Lecturers Table */}
      <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <CardHeader className="border-b border-white/10 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Lecturers Database</CardTitle>
              <CardDescription className="font-medium">
                Showing {paginatedLecturers.length} of {filteredLecturers.length} registered faculty members
              </CardDescription>
            </div>
            <div className="text-xs font-bold text-primary-100 uppercase tracking-widest px-3 py-1 bg-primary-100/10 rounded-full border border-primary-100/20">
              {filteredLecturers.length} Total Members
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary-100/20 border-t-primary-100 rounded-full animate-spin" />
              <p className="text-sm font-bold text-primary-100 uppercase tracking-widest">Loading records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lecturer Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLecturers.map((lecturer) => (
                    <TableRow key={lecturer.id} className="group transition-all duration-300">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-100/20 to-primary-100/5 border border-primary-100/10 flex items-center justify-center text-primary-100 font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {lecturer.firstName[0]}{lecturer.lastName[0]}
                          </div>
                          <div className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-100 transition-colors">
                            {lecturer.firstName} {lecturer.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">{lecturer.email}</TableCell>
                      <TableCell>
                        <div className="text-xs font-bold px-2.5 py-1 bg-blue-100/10 text-blue-500 border border-blue-500/20 rounded-lg inline-block uppercase tracking-wider">
                          {lecturer.department || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold px-2.5 py-1 bg-purple-100/10 text-purple-500 border border-purple-500/20 rounded-lg inline-block uppercase tracking-wider">
                          {lecturer.position || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="glass">
                          {lecturer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary-100/10 hover:text-primary-100"
                            onClick={() => setSelectedLecturer(lecturer)}
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
                            onClick={() => handleDeleteClick(lecturer)}
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
          {filteredLecturers.length > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Page <span className="text-primary-100">{currentPage}</span> / {totalPages}
              </div>
              <div className="flex gap-2">
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

      {/* Lecturer Details Dialog */}
      <Dialog open={!!selectedLecturer} onOpenChange={() => setSelectedLecturer(null)}>
        <DialogContent className="max-w-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-white/20 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <DialogHeader className="p-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Lecturer Academic Profile</DialogTitle>
            <DialogDescription className="font-medium">
              Comprehensive information and performance metrics
            </DialogDescription>
          </DialogHeader>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
          {selectedLecturer && (
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Bio Information
                  </h4>
                  <div className="space-y-4 bg-primary-100/5 p-5 rounded-2xl border border-primary-100/10">
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</span>
                      <span className="text-sm font-bold">{selectedLecturer.firstName} {selectedLecturer.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                      <span className="text-sm font-bold">{selectedLecturer.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-primary-100/5 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</span>
                      <span className="text-sm font-bold">{selectedLecturer.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</span>
                      <span className="text-sm font-bold">{selectedLecturer.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary-100 rounded-full" />
                    Professional Status
                  </h4>
                  <div className="space-y-4 bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/20 dark:border-slate-700/50">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Employee ID</span>
                      <span className="text-sm font-bold text-primary-100">{selectedLecturer.employeeId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Department</span>
                      <span className="text-sm font-bold">{selectedLecturer.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Position</span>
                      <span className="text-sm font-bold">{selectedLecturer.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Office</span>
                      <span className="text-sm font-bold">{selectedLecturer.officeLocation} ({selectedLecturer.officeHours})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em]">Academic Assets</h4>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Qualifications</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLecturer.qualifications.map((qual, index) => (
                        <Badge key={index} variant="glass" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{qual}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLecturer.specialization.map((spec, index) => (
                        <Badge key={index} variant="glass" className="bg-blue-500/10 text-blue-500 border-blue-500/20">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary-100 uppercase tracking-[0.2em]">Efficiency Metrics</h4>
                  {lecturerStats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-100/10 to-transparent border border-primary-100/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Students</p>
                        <p className="text-2xl font-black">{lecturerStats.totalStudents}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100/10 to-transparent border border-emerald-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rating</p>
                        <p className="text-2xl font-black text-emerald-500">{lecturerStats.averageRating.toFixed(1)}/5</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100/10 to-transparent border border-blue-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Courses</p>
                        <p className="text-2xl font-black text-blue-500">{lecturerStats.totalCourses}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100/10 to-transparent border border-purple-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
                        <p className="text-2xl font-black text-purple-500">{lecturerStats.yearsOfExperience}y+</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Security Authorization Required</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-red-500">
              Confirm identity removal? This will permanently delete the lecturer account and all associated academic records. This action is final.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-white/20">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold border-none shadow-lg shadow-red-500/20">Authorize Deletion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LecturersPage;
