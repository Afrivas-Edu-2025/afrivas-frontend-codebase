'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateCourseMutation, useGetDepartmentsQuery, useGetLecturersQuery } from '@/services/adminApi'

interface CreateCourseFormProps {
  onSuccess?: () => void
}

export default function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
  const [open, setOpen] = useState(false)
  const [createCourse, { isLoading }] = useCreateCourseMutation()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: lecturersData } = useGetLecturersQuery({})

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    level: '',
    semester: '',
    departmentId: '',
    lecturerId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Course name is required'
    if (!formData.code.trim()) newErrors.code = 'Course code is required'
    if (!formData.level) newErrors.level = 'Level is required'
    if (!formData.semester) newErrors.semester = 'Semester is required'
    if (!formData.departmentId) newErrors.departmentId = 'Department is required'
    if (formData.credits < 1 || formData.credits > 6) newErrors.credits = 'Credits must be between 1 and 6'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await createCourse(formData).unwrap()
      
      toast.success('Course created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: 3,
        level: '',
        semester: '',
        departmentId: '',
        lecturerId: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating course:', error)
      toast.error(error?.data?.message || 'Failed to create course')
    }
  }

  const departments = departmentsData?.data || []
  const lecturers = lecturersData?.data || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter course name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter course code"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter course description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
                className={errors.credits ? 'border-red-500' : ''}
              />
              {errors.credits && <p className="text-red-500 text-sm mt-1">{errors.credits}</p>}
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                  <SelectItem value="500">500 Level</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Semester</SelectItem>
                  <SelectItem value="2">Second Semester</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
            </div>
            <div>
              <Label htmlFor="departmentId">Department</Label>
              <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
                <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="lecturerId">Lecturer (Optional)</Label>
            <Select value={formData.lecturerId} onValueChange={(value) => handleInputChange('lecturerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lecturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No lecturer assigned</SelectItem>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.firstName} {lecturer.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Course'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
