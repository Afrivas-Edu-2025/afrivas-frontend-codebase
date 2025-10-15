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
  Users
} from 'lucide-react'
import { toast } from 'sonner'
import CreateLecturerForm from '@/components/forms/CreateLecturerForm'
import { useGetAllLecturersQuery, useGetLecturerDetailsQuery, useDeleteLecturerFromUsersMutation } from '@/services/adminApi'

interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);

  // Fetch lecturers using adminApi service
  const { data, error, isLoading } = useGetAllLecturersQuery({ page: currentPage, search: searchTerm, department: filterDepartment, status: filterStatus });

  useEffect(() => {
    if (data) {
      const lecturersData = data.data || [];
      setLecturers(lecturersData);
      setTotalPages(data.totalPages || Math.ceil((data.total || lecturersData.length || 0) / 10));
      setCurrentPage(data.currentPage || currentPage);

      // Extract unique departments for filter from fetched data
      const uniqueDepartments = [...new Set(lecturersData.map((l: Lecturer) => l.department).filter(Boolean))];
      setDepartments(uniqueDepartments);
    }
    if (error) { 
      console.error('Error fetching lecturers:', error);
      toast.error('Failed to fetch lecturers');
    }
    setLoading(isLoading);
  }, [data, error, isLoading]);

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
    } catch (error) {
      console.error('Error deleting lecturer:', error)
      toast.error('Failed to delete lecturer')
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (lecturerId: string) => {
    setLecturerToDelete(lecturerId);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lecturers Management</h1>
          <p className="text-muted-foreground">Manage lecturer accounts and information</p>
        </div>
        <CreateLecturerForm onSuccess={() => {}} />
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lecturers.filter(l => l.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lecturers.length > 0 
                ? (lecturers.reduce((sum, l) => sum + l.averageRating, 0) / lecturers.length).toFixed(1)
                : '0.0'
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
                  placeholder="Search lecturers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment || 'all'} onValueChange={handleDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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

      {/* Lecturers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lecturers List</CardTitle>
          <CardDescription>
            Manage lecturer accounts and view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading lecturers...</div>
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
                {lecturers.map((lecturer) => (
                  <TableRow key={lecturer.id}>
                    <TableCell>
                      <div className="font-medium">
                        {lecturer.firstName} {lecturer.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{lecturer.email}</TableCell>
                    <TableCell>{lecturer.gender}</TableCell>
                    <TableCell>{lecturer.dateOfBirth ? new Date(lecturer.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{lecturer.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lecturer.isActive ? "default" : "secondary"}>
                        {lecturer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLecturer(lecturer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(lecturer.id)}
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

      {/* Lecturer Details Dialog */}
      <Dialog open={!!selectedLecturer} onOpenChange={() => setSelectedLecturer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lecturer Details</DialogTitle>
            <DialogDescription>
              Detailed information about the lecturer
            </DialogDescription>
          </DialogHeader>
          {selectedLecturer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedLecturer.firstName} {selectedLecturer.lastName}</p>
                    <p><strong>Email:</strong> {selectedLecturer.email}</p>
                    <p><strong>Phone:</strong> {selectedLecturer.phoneNumber}</p>
                    <p><strong>Gender:</strong> {selectedLecturer.gender}</p>
                    <p><strong>Date of Birth:</strong> {new Date(selectedLecturer.dateOfBirth).toDateString()}</p>
                    <p><strong>Address:</strong> {selectedLecturer.address}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Professional Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Employee ID:</strong> {selectedLecturer.employeeId}</p>
                    <p><strong>Department:</strong> {selectedLecturer.department}</p>
                    <p><strong>Position:</strong> {selectedLecturer.position}</p>
                    <p><strong>Office:</strong> {selectedLecturer.officeLocation}</p>
                    <p><strong>Office Hours:</strong> {selectedLecturer.officeHours}</p>
                    <p><strong>Status:</strong> {selectedLecturer.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Qualifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLecturer.qualifications.map((qual, index) => (
                    <Badge key={index} variant="secondary">{qual}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLecturer.specialization.map((spec, index) => (
                    <Badge key={index} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </div>

              {lecturerStats && (
                <div>
                  <h4 className="font-semibold mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <p><strong>Total Courses:</strong> {lecturerStats.totalCourses}</p>
                      <p><strong>Total Students:</strong> {lecturerStats.totalStudents}</p>
                    </div>
                    <div className="text-sm">
                      <p><strong>Average Rating:</strong> {lecturerStats.averageRating.toFixed(1)}</p>
                      <p><strong>Years of Experience:</strong> {lecturerStats.yearsOfExperience}</p>
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
              This action cannot be undone. This will permanently delete the lecturer account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LecturersPage;