'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateSemesterMutation } from '@/services/adminApi'

interface CreateSemesterFormProps {
  onSuccess?: () => void
}

export default function CreateSemesterForm({ onSuccess }: CreateSemesterFormProps) {
  const [open, setOpen] = useState(false)
  const [createSemester, { isLoading }] = useCreateSemesterMutation()

  const currentYear = new Date().getFullYear()
  const defaultAcademicYear = `${currentYear}/${currentYear + 1}`

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    academicYear: defaultAcademicYear,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Semester name is required'
    if (!formData.code.trim()) newErrors.code = 'Semester code is required'
    if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic year is required'
    if (!/^\d{4}\/\d{4}$/.test(formData.academicYear)) newErrors.academicYear = 'Format must be YYYY/YYYY'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end < start) newErrors.endDate = 'End date cannot be before start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await createSemester({
        name: formData.name,
        code: formData.code,
        startDate: formData.startDate,
        endDate: formData.endDate,
        academicYear: formData.academicYear,
      }).unwrap()

      toast.success('Semester created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        academicYear: defaultAcademicYear,
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating semester:', error)
      toast.error(error?.data?.message || 'Failed to create semester')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Semester
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Semester</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Semester Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., First Semester"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="code">Semester Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g., SEM-1"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              placeholder="YYYY/YYYY"
              className={errors.academicYear ? 'border-red-500' : ''}
            />
            {errors.academicYear && <p className="text-red-500 text-sm mt-1">{errors.academicYear}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
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
                'Create Semester'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}