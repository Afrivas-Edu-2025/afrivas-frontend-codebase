'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateClassMutation, useGetCoursesQuery, useGetLecturersQuery, useGetSemestersQuery } from '@/services/adminApi'

interface CreateClassFormProps {
  onSuccess?: () => void
}

export default function CreateClassForm({ onSuccess }: CreateClassFormProps) {
  const [open, setOpen] = useState(false)
  const [createClass, { isLoading }] = useCreateClassMutation()
  const { data: coursesData } = useGetCoursesQuery()
  const { data: lecturersData } = useGetLecturersQuery({})
  const { data: semestersData } = useGetSemestersQuery()

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    lecturerId: '',
    academicYear: new Date().getFullYear().toString(),
    semesterId: '',
    room: '',
    schedule: '',
    capacity: 30,
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
    if (!formData.name.trim()) newErrors.name = 'Class name is required'
    if (!formData.code.trim()) newErrors.code = 'Class code is required'
    if (!formData.courseId) newErrors.courseId = 'Course is required'
    if (!formData.lecturerId) newErrors.lecturerId = 'Lecturer is required'
    if (!formData.semesterId) newErrors.semesterId = 'Semester is required'
    if (formData.capacity < 1 || formData.capacity > 200) newErrors.capacity = 'Capacity must be between 1 and 200'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await createClass({ ...formData }).unwrap()
      toast.success('Class created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        code: '',
        courseId: '',
        lecturerId: '',
        academicYear: new Date().getFullYear().toString(),
        semesterId: '',
        room: '',
        schedule: '',
        capacity: 30,
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating class:', error)
      toast.error(error?.data?.message || 'Failed to create class')
    }
  }

  const courses = coursesData?.data || []
  const lecturers = lecturersData?.data || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter class name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="code">Class Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter class code"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseId">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => handleInputChange('courseId', value)}>
                <SelectTrigger className={errors.courseId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
            </div>
            <div>
              <Label htmlFor="lecturerId">Lecturer</Label>
              <Select value={formData.lecturerId} onValueChange={(value) => handleInputChange('lecturerId', value)}>
                <SelectTrigger className={errors.lecturerId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select lecturer" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.firstName} {lecturer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lecturerId && <p className="text-red-500 text-sm mt-1">{errors.lecturerId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                placeholder="Enter academic year"
              />
            </div>
            <div>
              <Label htmlFor="semesterId">Semester</Label>
              <Select value={formData.semesterId} onValueChange={(value) => handleInputChange('semesterId', value)}>
                <SelectTrigger className={errors.semesterId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semesterId && <p className="text-red-500 text-sm mt-1">{errors.semesterId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room">Room (Optional)</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
                placeholder="Enter room number"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="200"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                className={errors.capacity ? 'border-red-500' : ''}
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="schedule">Schedule (Optional)</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              placeholder="Enter class schedule (e.g., Mon-Wed-Fri 10:00-11:30)"
            />
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
                'Create Class'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
