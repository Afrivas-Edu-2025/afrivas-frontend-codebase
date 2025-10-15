'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateStudentMutation } from '@/services/adminApi'

interface CreateStudentFormProps {
  onSuccess?: () => void
}

export default function CreateStudentForm({ onSuccess }: CreateStudentFormProps) {
  const [open, setOpen] = useState(false)
  const [createStudent, { isLoading }] = useCreateStudentMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    year: '',
    semester: '',
    faculty: '',
    department: '',
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
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.semester) newErrors.semester = 'Semester is required'
    if (!formData.faculty) newErrors.faculty = 'Faculty is required'
    if (!formData.department) newErrors.department = 'Department is required'

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
        email: formData.email,
        password: formData.password,
        gender: formData.gender.toUpperCase(),
        dob: new Date(formData.dob).toISOString(),
        role: 'STUDENT',
        year: formData.year,
        semester: formData.semester,
        faculty: formData.faculty,
        department: formData.department,
        institutionId: '550e8400-e29b-41d4-a716-446655440000',
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
        year: '',
        semester: '',
        faculty: '',
        department: '',
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
                  <SelectItem value="other">Other</SelectItem>
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
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Year 1</SelectItem>
                  <SelectItem value="2">Year 2</SelectItem>
                  <SelectItem value="3">Year 3</SelectItem>
                  <SelectItem value="4">Year 4</SelectItem>
                </SelectContent>
              </Select>
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="faculty">Faculty</Label>
            <Input
              id="faculty"
              value={formData.faculty}
              onChange={(e) => handleInputChange('faculty', e.target.value)}
              placeholder="Enter faculty"
              className={errors.faculty ? 'border-red-500' : ''}
            />
            {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty}</p>}
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Enter department"
              className={errors.department ? 'border-red-500' : ''}
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
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
