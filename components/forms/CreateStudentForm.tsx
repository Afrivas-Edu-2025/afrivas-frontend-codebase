'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateStudentMutation, useGetFacultiesQuery, useGetDepartmentsByFacultyQuery } from '@/services/adminApi'

interface CreateStudentFormProps {
  onSuccess?: () => void
}

export default function CreateStudentForm({ onSuccess }: CreateStudentFormProps) {
  const [open, setOpen] = useState(false)
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const { data: facultiesData, isLoading: isLoadingFaculties } = useGetFacultiesQuery()
  const faculties = facultiesData?.data || []

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    studentId: '',
    levelId: '1',
    facultyId: '',
    deptId: '',
  })

  const { data: departmentsData, isLoading: isLoadingDepts } = useGetDepartmentsByFacultyQuery(formData.facultyId, {
    skip: !formData.facultyId
  })
  const departments = departmentsData?.data || []

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.dob) newErrors.dob = 'Date of birth is required'
    if (!formData.facultyId) newErrors.facultyId = 'Faculty is required'
    if (!formData.deptId) newErrors.deptId = 'Department is required'
    if (!formData.studentId) newErrors.studentId = 'Student ID is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.email.split('@')[0],
        gender: formData.gender.toUpperCase(),
        dob: new Date(formData.dob).toISOString(),
        role: 'STUDENT',
        facultyId: parseInt(formData.facultyId),
        deptId: parseInt(formData.deptId),
        levelId: parseInt(formData.levelId),
        studentId: parseInt(formData.studentId),
        schoolId: 1, // Default for now, should ideally be dynamic if multiple schools
      }

      await createStudent(studentData).unwrap()
      setFormError(null)
      toast.success('Student created successfully!')
      setOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        dob: '',
        studentId: '',
        levelId: '1',
        facultyId: '',
        deptId: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating student:', error)
      const backendMessage = error?.data?.message || error?.message || 'Failed to create student'
      setFormError(backendMessage)
      toast.error(backendMessage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter password (min 8 characters)"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="middleName">Middle Name (Optional)</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <Label htmlFor="studentId">Student University ID (Numeric)</Label>
              <Input
                id="studentId"
                type="number"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Enter numeric ID"
                className={errors.studentId ? 'border-red-500' : ''}
              />
              {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className={errors.dob ? 'border-red-500' : ''}
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facultyId">Faculty</Label>
              <Select value={formData.facultyId} onValueChange={(value) => handleInputChange('facultyId', value)}>
                <SelectTrigger className={errors.facultyId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={isLoadingFaculties ? "Loading..." : "Select faculty"} />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f: any) => (
                    <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.facultyId && <p className="text-red-500 text-sm mt-1">{errors.facultyId}</p>}
            </div>
            <div>
              <Label htmlFor="deptId">Department</Label>
              <Select value={formData.deptId} onValueChange={(value) => handleInputChange('deptId', value)} disabled={!formData.facultyId}>
                <SelectTrigger className={errors.deptId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={isLoadingDepts ? "Loading..." : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.deptId && <p className="text-red-500 text-sm mt-1">{errors.deptId}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isCreating ? 'Creating...' : 'Create Student'}
            </Button>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2 text-center">{formError}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
