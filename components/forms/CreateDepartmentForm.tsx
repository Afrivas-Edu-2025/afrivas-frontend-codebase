'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateDepartmentMutation, useGetFacultiesQuery } from '@/services/adminApi'

interface CreateDepartmentFormProps {
  onSuccess?: () => void
}

export default function CreateDepartmentForm({ onSuccess }: CreateDepartmentFormProps) {
  const [open, setOpen] = useState(false)
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation()
  const { data: facultiesData } = useGetFacultiesQuery()

  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
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

    if (!formData.name.trim()) newErrors.name = 'Department name is required'
    if (formData.name.length < 3) newErrors.name = 'Department name must be at least 3 characters'
    if (!formData.facultyId) newErrors.facultyId = 'Faculty is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await createDepartment(formData).unwrap()
      
      toast.success('Department created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        facultyId: '',
      })
      setErrors({})
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating department:', error)
      toast.error(error?.data?.message || 'Failed to create department')
    }
  }

  const faculties = facultiesData?.data || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter department name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="facultyId">Faculty</Label>
            <Select value={formData.facultyId} onValueChange={(value) => handleInputChange('facultyId', value)}>
              <SelectTrigger className={errors.facultyId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facultyId && <p className="text-red-500 text-sm mt-1">{errors.facultyId}</p>}
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
                'Create Department'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
