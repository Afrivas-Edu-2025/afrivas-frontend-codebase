'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, Users, UserCheck, GraduationCap, RefreshCw } from 'lucide-react'
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
        toast.error('Only student and lecturer accounts are supported here.')
        return
      }
      toast.success('User deleted successfully')
      refetch()
    } catch (deleteError: any) {
      toast.error(deleteError?.data?.message || 'Failed to delete user')
    } finally {
      setUserToDelete(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading users...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Failed to load users. Please try again.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage users for this university.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">All Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLecturers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Filter by name/email and role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search users..."
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value: 'ALL' | 'STUDENT' | 'LECTURER') => {
                setRoleFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="LECTURER">Lecturers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing {paginatedUsers.length} of {filteredUsers.length} filtered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={String(user.id)}>
                    <TableCell className="font-medium">
                      {user.firstName || ''} {user.lastName || ''}
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'STUDENT' ? 'secondary' : 'outline'}>
                        {user.role || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isApproved ? 'default' : 'secondary'}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{' '}
              ({userToDelete?.role}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
