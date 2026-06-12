'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateStudentMutation, useGetDepartmentsQuery, useGetFacultiesQuery, useGetLevelsQuery } from '@/services/adminApi'

interface CreateStudentFormProps {
  onSuccess?: () => void
}

export default function CreateStudentForm({ onSuccess }: CreateStudentFormProps) {
  const [open, setOpen] = useState(false)
  const [createStudent, { isLoading }] = useCreateStudentMutation()
  const { data: facultiesData } = useGetFacultiesQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: levelsData } = useGetLevelsQuery()
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    levelId: '',
    facultyId: '',
    departmentId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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
    if (!formData.levelId) newErrors.levelId = 'Level is required'
    if (!formData.facultyId) newErrors.facultyId = 'Faculty is required'
    if (!formData.departmentId) newErrors.departmentId = 'Department is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const studentData = {
        appOrigin: window.location.origin,
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.email.split('@')[0].toLowerCase(),
          email: formData.email,
          password: formData.password,
          role: 'STUDENT',
          facultyId: Number(formData.facultyId),
          deptId: Number(formData.departmentId),
        },
        userProfile: {
          gender: formData.gender.toUpperCase(),
          bio: `Student profile for ${formData.firstName} ${formData.lastName}`,
          address: 'Not provided',
          city: 'Not provided',
          country: 'Not provided',
          birthDate: new Date(formData.dob).toISOString(),
          phoneNumber: 'N/A',
          nationalId: `NID-${Date.now()}`,
          passportNumber: `PASS-${Date.now()}`,
          profilePicture: 'https://via.placeholder.com/150',
        },
        student: {
          studentId: Math.floor(100000 + Math.random() * 900000),
          levelId: Number(formData.levelId),
        },
      }

      await createStudent(studentData).unwrap()
      setFormError(null)
      toast.success('Student created successfully!')
      setOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        gender: '',
        dob: '',
        levelId: '',
        facultyId: '',
        departmentId: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating student:', error)
      const backendMessage = error?.data?.message || error?.message || 'Failed to create student'
      setFormError(backendMessage)
      toast.error(backendMessage)
      if (backendMessage.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: backendMessage }))
      }
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
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
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
              <Label htmlFor="levelId">Level</Label>
              <Select value={formData.levelId} onValueChange={(value) => handleInputChange('levelId', value)}>
                <SelectTrigger className={errors.levelId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {(levelsData?.data || []).map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.levelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.levelId && <p className="text-red-500 text-sm mt-1">{errors.levelId}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="facultyId">Faculty</Label>
            <Select value={formData.facultyId} onValueChange={(value) => handleInputChange('facultyId', value)}>
              <SelectTrigger className={errors.facultyId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {(facultiesData?.data || []).map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facultyId && <p className="text-red-500 text-sm mt-1">{errors.facultyId}</p>}
          </div>

          <div>
            <Label htmlFor="departmentId">Department</Label>
            <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
              <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {(departmentsData?.data || [])
                  .filter((department) => !formData.facultyId || department.facultyId === formData.facultyId)
                  .map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isLoading ? 'Creating...' : 'Create Student'}
            </Button>
            {formError && <p className="text-red-500 text-sm mt-2 text-center">{formError}</p>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
